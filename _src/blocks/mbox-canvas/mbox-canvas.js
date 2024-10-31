import { Target } from '../../scripts/libs/data-layer.js';

export default async function decorate(block) {
  block.innerHTML += `
        <div data-mbox="something">

        </div>
    `;
  const offer = await Target.getMbox('something');
  console.log(offer);
}
