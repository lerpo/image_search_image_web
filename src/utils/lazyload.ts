import loadable from '@loadable/component';
import LoadingComponent from '@/components/LoadingComponent';

function load(fn, options) {
  const Component = loadable(fn, options);

  Component.preload = fn?.requireAsync || fn;

  return Component;
}

export default (loader) => load(loader, {
  fallback: LoadingComponent(),
});
