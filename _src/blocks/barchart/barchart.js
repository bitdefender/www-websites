export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    Array.from(row.children).forEach((child) => li.appendChild(child));
    li.children[1]?.classList.add('barchart-body');
    ul.append(li);
  });

  ul.querySelectorAll('.barchart-body').forEach((container) => {
    const progressBars = container.querySelectorAll('ul li:nth-child(odd)');
    progressBars.forEach((progressBar) => {
      const value = (parseFloat(progressBar.nextElementSibling.textContent / 6) * 100).toFixed(2);
      progressBar.style.setProperty('--bar-width', `${value}%`);
    });
  });

  Array.from(block.children).forEach((child) => child.remove());
  block.appendChild(ul);
}
