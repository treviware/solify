import {boot} from 'quasar/wrappers';
import {useGlobalStore} from 'stores/global';

export default boot(() => {
    window.addEventListener('resize', () => {
        const store = useGlobalStore();
        store.windowWidth = window.innerWidth;
        store.windowHeight = window.innerHeight;
    });
});
