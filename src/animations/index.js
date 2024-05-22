export const slideMenuUpDown = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInOutWithOpacity = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpDownWithScale = {
  initial: { opacity: 0, scale: 0.6, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.6, y: 20 },
};

export const scaleInOut = (index) => {
  return {
    initial: { opacity: 0, scale: 0.85 },
    transition: { delay: index * 0.5, ease: "easeInOut" },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85 },
  };
};

export const opacityINOut = (index) => {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { delay: index * 0.1, ease: "easeInOut" },
  };
};
