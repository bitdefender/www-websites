function applySpacing(sectionStyle, spacing) {
  const {
    paddingTop,
    paddingBottom,
    marginTop,
    marginBottom,
  } = spacing;

  if (paddingTop) sectionStyle.paddingTop = `${paddingTop}rem`;
  if (paddingBottom) sectionStyle.paddingBottom = `${paddingBottom}rem`;
  if (marginTop) sectionStyle.marginTop = `${marginTop}rem`;
  if (marginBottom) sectionStyle.marginBottom = `${marginBottom}rem`;
}

function applyBackground(sectionStyle, backgroundImage, backgroundRepeat, backgroundPosition) {
  sectionStyle.backgroundImage = `url("${backgroundImage}")`;
  sectionStyle.backgroundPosition = backgroundPosition || '0 0';
  sectionStyle.backgroundRepeat = backgroundRepeat || 'no-repeat';
  sectionStyle.backgroundBlendMode = 'unset';
}

export default function decorate(block) {
  const section = block.closest('.section');
  const sectionStyle = section.style;
  const blockStyle = block.style;
  const {
    backgroundImage,
    backgroundRepeat,
    backgroundPosition,
    backgroundColor,
    textColor,
    paddingTop,
    paddingBottom,
    marginTop,
    marginBottom,
  } = section.dataset;

  // padding and margin
  applySpacing(sectionStyle, {
    paddingTop,
    paddingBottom,
    marginTop,
    marginBottom,
  });

  // text color
  blockStyle.color = textColor || 'white';

  // background properties
  if (backgroundImage) {
    applyBackground(sectionStyle, backgroundImage, backgroundRepeat, backgroundPosition);
  }

  sectionStyle.backgroundColor = backgroundColor || 'black';
}
