import {Main} from './Main';

window.onload = function (): void {
    const main = new Main();
    main.run().catch(x => {
        console.error(x);
    });
};
