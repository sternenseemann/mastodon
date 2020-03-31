import Rails from '@rails/ujs';
import { startSyncUjs } from './utils/sync-ujs';

export function start() {
  require('font-awesome/css/font-awesome.css');
  require.context('../images/', true);

  try {
    Rails.start();
    startSyncUjs();
  } catch (e) {
    // If called twice
  }
};
