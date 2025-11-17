import { useState } from 'react';

export default function useRequest<T = any, K = any>(executor: (...args: T[]) => K) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  async function run(...args: any[]) {
    setLoading(true);

    try {
      const response = await executor.apply(null, args);

      setData(response);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    data,
    run,
  }
}
