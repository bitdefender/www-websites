const SVG_NS = 'http://www.w3.org/2000/svg';

const WIGGLE_AMP = 6;
const WIGGLE_SPEED = 0.001;
const CARD_DRIFT = 12;
const PROXIMITY_R = 140;
const PROXIMITY_AMP = 28;
const EASE = 0.08;

/* BLUR LOGIC */
const ADJ = [
    [5, 1, 2, 3],
    [0, 2, 4],
    [1, 3, 5, 0],
    [2, 4, 0],
    [3, 5, 1],
    [4, 0, 2]
];

const INITIAL_BLURRED = [4, 5];

let instances = [];
let running = false;

export function initAnimations(block) {
    if (!block) return;

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.classList.add('parallax-lines-svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');

    block.appendChild(svg);

    const nodes = [];
    const lines = [];
    const rectMap = new Map();
    const icons = block.querySelectorAll('.parallax-icon');

    // NODES
    icons.forEach((el, i) => {
        const base = getComputedStyle(el).transform;
        const baseTransform = base && base !== 'none' ? base + ' ' : '';

        nodes.push({
            el,
            id: i,
            baseTransform,
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            freqX: 0.7 + Math.random() * 0.6,
            freqY: 0.7 + Math.random() * 0.6,
            cx: 0,
            cy: 0,
            tx: 0,
            ty: 0,
            dist: Infinity
        });

        // initial blur
        el.classList.toggle(
            'parallax-icon--blurred',
            INITIAL_BLURRED.includes(i)
        );
    });

    // LINES
    for (let i = 0; i < icons.length; i++) {
        for (let j = i + 1; j < icons.length; j++) {
            const line = document.createElementNS(SVG_NS, 'line');
            line.classList.add('parallax-line');
            svg.appendChild(line);

            lines.push({
                line,
                elA: icons[i],
                elB: icons[j],
            });
        }
    }

    const instance = {
        block,
        svg,
        nodes,
        lines,
        rectMap,
        mouseIn: false,
        mx: 0,
        my: 0,
        rawX: 0,
        rawY: 0,
    };

    /* EVENTS */
    block.addEventListener('mouseenter', () => (instance.mouseIn = true));

    block.addEventListener('mouseleave', () => {
        instance.mouseIn = false;
        instance.mx = instance.my = 0;

        // reset blur
        nodes.forEach((n) => {
            n.el.classList.toggle(
                'parallax-icon--blurred',
                INITIAL_BLURRED.includes(n.id)
            );
        });
    });

    block.addEventListener('mousemove', (e) => {
        const r = block.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;

        instance.mx = (e.clientX - cx) / (r.width / 2);
        instance.my = (e.clientY - cy) / (r.height / 2);

        instance.rawX = e.clientX - r.left;
        instance.rawY = e.clientY - r.top;
    });

    // viewBox fix
    const updateViewBox = () => {
        svg.setAttribute(
            'viewBox',
            `0 0 ${block.offsetWidth} ${block.offsetHeight}`
        );
    };

    updateViewBox();
    window.addEventListener('resize', updateViewBox);

    instances.push(instance);

    if (!running) {
        running = true;
        requestAnimationFrame(tick);
    }
}

function tick(t) {
    instances.forEach((inst) => {
        const { block, nodes, lines, rectMap } = inst;
        const cardRect = block.getBoundingClientRect();

        // cache rects
        nodes.forEach((n) => {
            const r = n.el.getBoundingClientRect();
            rectMap.set(n.el, r);

            if (inst.mouseIn) {
                const cx = r.left + r.width / 2 - cardRect.left;
                const cy = r.top + r.height / 2 - cardRect.top;

                const dx = cx - inst.rawX;
                const dy = cy - inst.rawY;

                n.dist = Math.sqrt(dx * dx + dy * dy);
            } else {
                n.dist = Infinity;
            }
        });

        /* BLUR SWITCH LOGIC */
        if (inst.mouseIn) {
            nodes.forEach((n) => {
                if (
                    n.el.classList.contains('parallax-icon--blurred') &&
                    n.dist < PROXIMITY_R
                ) {
                    n.el.classList.remove('parallax-icon--blurred');

                    const neighbors = ADJ[n.id] || [];
                    neighbors.forEach((nid) => {
                        const neighbor = nodes[nid];
                        if (neighbor) {
                            neighbor.el.classList.add('parallax-icon--blurred');
                        }
                    });
                }
            });
        }

        /* MOVE */
        nodes.forEach((n) => {
            const wx =
                Math.sin(t * WIGGLE_SPEED * n.freqX + n.phaseX) * WIGGLE_AMP;
            const wy =
                Math.sin(t * WIGGLE_SPEED * n.freqY + n.phaseY) * WIGGLE_AMP;

            const dx = inst.mouseIn ? -inst.mx * CARD_DRIFT : 0;
            const dy = inst.mouseIn ? -inst.my * CARD_DRIFT : 0;

            let fx = 0, fy = 0;

            if (inst.mouseIn && n.dist < PROXIMITY_R && n.dist > 0) {
                const strength = 1 - n.dist / PROXIMITY_R;
                const push = strength * strength * PROXIMITY_AMP;

                const r = rectMap.get(n.el);
                const cx = r.left + r.width / 2 - cardRect.left;
                const cy = r.top + r.height / 2 - cardRect.top;

                const dx2 = cx - inst.rawX;
                const dy2 = cy - inst.rawY;

                fx = (dx2 / n.dist) * push;
                fy = (dy2 / n.dist) * push;
            }

            n.tx = wx + dx + fx;
            n.ty = wy + dy + fy;

            n.cx += (n.tx - n.cx) * EASE;
            n.cy += (n.ty - n.cy) * EASE;

            n.el.style.transform =
                n.baseTransform +
                `translate(${n.cx.toFixed(2)}px, ${n.cy.toFixed(2)}px)`;
        });

        /* LINES */
        lines.forEach(({ line, elA, elB }) => {
            const rA = rectMap.get(elA);
            const rB = rectMap.get(elB);
            if (!rA || !rB) return;

            const ax = rA.left + rA.width / 2 - cardRect.left;
            const ay = rA.top + rA.height / 2 - cardRect.top;
            const bx = rB.left + rB.width / 2 - cardRect.left;
            const by = rB.top + rB.height / 2 - cardRect.top;

            line.setAttribute('x1', ax);
            line.setAttribute('y1', ay);
            line.setAttribute('x2', bx);
            line.setAttribute('y2', by);

            line.style.opacity = inst.mouseIn ? 0.5 : 0.15;
        });
    });

    requestAnimationFrame(tick);
}

export const bdHeroStates = (function () {
    let steps = [];
    let current = 0;
    let phaseTimer;
    const ENTER_MS = 1000;
    const EXIT_MS = 1000;
    const FIRST_HOLD = 2600;
    const SECOND_HOLD = 2200;

    function show(idx) {
        const incoming = steps[idx];
        if (!incoming) return;

        if (steps[current]) {
            steps[current].classList.remove('bd-hero-glass--active', 'bd-hero-glass-enter', 'bd-hero-glass-exit-top');
        }

        current = idx;
        incoming.classList.remove('bd-hero-glass-enter', 'bd-hero-glass-exit-top');
        incoming.classList.add('bd-hero-glass--active');

        void incoming.offsetWidth;
        incoming.classList.add('bd-hero-glass-enter');
    }

    function exitCurrent(nextIdx) {
        const outgoing = steps[current];
        if (!outgoing) {
            show(nextIdx);
            return;
        }

        outgoing.classList.remove('bd-hero-glass-enter');
        outgoing.classList.add('bd-hero-glass-exit-top');

        clearTimeout(phaseTimer);
        phaseTimer = setTimeout(function () {
            outgoing.classList.remove('bd-hero-glass--active', 'bd-hero-glass-exit-top');
            show(nextIdx);
            queueNext();
        }, EXIT_MS);
    }

    function queueNext() {
        const hold = current === 0 ? FIRST_HOLD : SECOND_HOLD;
        clearTimeout(phaseTimer);
        phaseTimer = setTimeout(function () {
            exitCurrent(current === 0 ? 1 : 0);
        }, ENTER_MS + hold);
    }

    function runCycle() {
        show(0);
        queueNext();
    }

    function init() {
        const group = document.querySelector('.bd-hero-glass-group');
        if (!group) return;

        steps = Array.from(group.querySelectorAll('.bd-hero-glass--state'));
        if (steps.length < 2) return;

        runCycle();
    }

    return { init };
})();
