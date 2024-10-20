import { AnimatePresence, motion } from 'framer-motion';

const AnimationWrapper = ({ children, initial = { opacity: 0 }, animate = { opacity: 1 } }) => {
  return (
    <motion.div
        initial={initial}
        animmate={animate}
    >
        { children }
    </motion.div>
  )
}

export default AnimationWrapper




// import { AnimatePresence, motion } from 'framer-motion';

// const AnimationWrapper = ({ children, initial = { opacity: 0 }, animate = { opacity: 1 } }) => {
//   return (
//     <motion.div
//         initial={initial}
//         animmate={animate}
//     >
//         { children }
//     </motion.div>
//   )
// }

// export default AnimationWrapper