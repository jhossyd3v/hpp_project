(function endlessScroll() {
    let currentPage = 0;
    let hasMore = false;
    let getMore = false;
    let initialSteps = 10;
    let steps = 10;

    let getNextPage = function () {
        return new Promise((resolve, reject) => {
            resolve({ result: false });
        });
    };

    let afterGetNextPage = function () { }
    let beforeGetNextPage = function () { }

    let load = function () {
        if (getMore && hasMore) {
            let start = 0;
            let stepsToUse = steps;
            getMore = false;
            if (currentPage > 0) {
                start = initialSteps + (steps * (currentPage - 1));
            }
            if (currentPage === 0) {
                stepsToUse = initialSteps;
            }
            console.log({ start, currentPage, stepsToUse, steps, initialSteps });
            getNextPage(start, stepsToUse)
                .then(response => {
                    if (response.result) {
                        hasMore = true;
                        getMore = true;
                        currentPage++;
                    } else {
                        hasMore = false;
                        getMore = false;
                    }
                }).catch(error => {
                    console.log(error);
                });
        }
    }

    let listen = function () {
        let height = document.documentElement.scrollHeight;
        let offset = document.documentElement.scrollTop + window.innerHeight;

        if (offset === height && hasMore && getMore) {
            load();
        }
    }

    let reset = function () {
        getMore = false;
        hasMore = false;
        currentPage = 0;
    }

    let init = function () {
        window.addEventListener('scroll', listen);
        // let mainElement = document.getElementsByTagName('main')[0];
        // mainElement.addEventListener('touchmove', listen);
        document.addEventListener('touchmove', listen);
        getMore = true;
        hasMore = true;
        load();
    }

    let config = function (initialStepsConf = 10, stepsConf = 10, getItemsConf = function () { }) {
        initialSteps = initialStepsConf;
        steps = stepsConf;
        getNextPage = getItemsConf;
    }

    if (!window.hasOwnProperty('endlessScroll')) {
        window.endlessScroll = {
            config: config,
            init: init,
            reset: reset
        };
    }
})()