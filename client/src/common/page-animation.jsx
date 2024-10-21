import { AnimatePresence, motion } from 'framer-motion';

const AnimationWrapper = ({ children, keyValue, initial = { opacity: 0 }, animate = { opacity: 1 }, transition = { duration: 1 }, className }) => {
  return (
    <AnimatePresence>
      <motion.div
        key={keyValue}
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
      >
          { children }
      </motion.div>
    </AnimatePresence>
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