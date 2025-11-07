export const getRandomGradient = () => {
  const gradients = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-orange-500',
    'from-red-500 to-pink-500',
    'from-indigo-500 to-purple-500',
    'from-teal-500 to-green-500',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
    'from-fuchsia-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-sky-500 to-indigo-500',
    'from-amber-500 to-orange-500',
    'from-lime-500 to-green-500',
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export const generateCoverData = (title) => {
  return {
    gradient: getRandomGradient(),
    title: title || 'Untitled',
  };
};