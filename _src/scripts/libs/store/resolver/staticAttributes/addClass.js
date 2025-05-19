/**
 * @param {HTMLElement} element 
 * @param {import("../resolver").Context} context 
 */
export const resolve = (element, context) => {
    if (element.dataset.storeAddClass === undefined) { return; }

    const constraintsList = element.dataset.storeAddClass.split(';');

    for (const constraint of constraintsList) {
        const [conditionsList, classList] = constraint.split('=');
        const classes = classList.split(',');
        const conditions = conditionsList.split(',');
        let passed = true;

        for (const condition of conditions) {
            switch (condition) {
                case 'minDevicesReached':
                    const [minDevices] = context.product.getMinMaxDeviceNumbers();

                    if (minDevices !== context.devices) {
                        passed = false;
                    }
                    break;
                case 'maxDevicesReached':
                    const [, maxDevices] = context.product.getMinMaxDeviceNumbers();

                    if (maxDevices !== context.devices) {
                        passed = false;
                    }
                    break;
            }

            if (!passed) {
                break;
            }
        }

        if (passed) {
            element.classList.add(...classes);
        } else {
            element.classList.remove(...classes);
        }
    }
}