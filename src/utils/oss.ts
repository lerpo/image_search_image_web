import SparkMD5 from 'spark-md5';
import COS from 'cos-js-sdk-v5';
import { getUploadCredentials } from '@/api/materiel';

export const UPLOAD_STATUS = {
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
  CANCEL: 'CANCEL',
}

const tempInfo = {};

const cosInstance = new COS({
  getAuthorization: async function (options, callback) {
    const { Query } = options;
    const fileKey = Query.prefix;
    const credentials = tempInfo[fileKey];

    callback({
      TmpSecretId: credentials.credentials.tmpSecretId,
      TmpSecretKey: credentials.credentials.tmpSecretKey,
      SecurityToken: credentials.credentials.sessionToken,
      StartTime: credentials.startTime,
      ExpiredTime: credentials.expiredTime,
    });
  }
});

const CHUNK_SIZE = 1 * 1024 * 1024;

export function calculateHashSample(file) {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    const size = file.size;
    const offset = CHUNK_SIZE;

    let chunks = [file.slice(0, offset)];
    let current = offset;

    while (current < size) {
      if (current + offset > size) {
        chunks.push(file.slice(current));
      } else {
        const mid = current + offset / 2;
        const end = current + offset;
        chunks.push(file.slice(current, current + 2));
        chunks.push(file.slice(mid, mid + 2));
        chunks.push(file.slice(end - 2, end));
      }
      current += offset;
    }
    reader.readAsArrayBuffer(new Blob(chunks));
    reader.onload = e => {
      spark.append(e.target.result);

      resolve(spark.end());
    }
  });
}

export async function uploadResource(file, callback) {
  const fileSuffix = getFileSuffix(file.name);
  const fileHash = await calculateHashSample(file);
  const result = await getUploadCredentials({
    type: 'video',
  });

  const { bucket, region, domain, upload_path, credentials } = result;
  const fileKey = `${upload_path}${fileHash}_${Date.now()}.${fileSuffix}`;


  tempInfo[fileKey] = credentials;

  cosInstance.sliceUploadFile({
    Bucket: bucket,
    Region: region,
    Key: fileKey,
    Body: file,
    onTaskReady: function (taskId) {
      callback({
        action: 'id',
        value: taskId,
      });
    },
    onHashProgress: ({ percent }) => {
      const progress = Number((percent * 0.1 * 100).toFixed(2));

      callback({
        action: 'progress',
        value: progress,
      });
    },
    onProgress: ({ percent }) => {
      const progress = Number(((percent + 0.1) * 0.8 * 100).toFixed(2));

      callback({
        action: 'progress',
        value: progress,
      });
    }
  }, function (err, data) {
    if (err) {
      callback({
        action: 'result',
        value: {
          status: UPLOAD_STATUS.FAIL,
          error: err,
        },
      });
    } else {
      callback({
        action: 'result',
        value: {
          status: UPLOAD_STATUS.SUCCESS,
          data: `${domain}${fileKey}`,
        },
      });
    }
  });
}

export function getFileSuffix(fileName: string) {
  const suffixIndex = fileName.lastIndexOf('.');

  return fileName.slice(suffixIndex + 1);
}

export function cancalUpload(taskId: string) {
  cosInstance.cancelTask(taskId);
}

export function restartUpload(taskId: string) {
  cosInstance.restartTask(taskId);
}