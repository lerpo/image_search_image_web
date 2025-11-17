
import { configureStore } from '@reduxjs/toolkit';

import route from './reducers/route';
import materiel from './reducers/materiel';

export default configureStore({
  reducer: {
    'route': route,
    'materiel': materiel,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
