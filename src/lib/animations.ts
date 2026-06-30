import type { Variants } from "framer-motion"

export const dashboardVariants = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 30,
      }
    },
  },
}

export const widgetHover: Variants = {
  rest: {
    scale: 1,
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  },
  hover: {
    scale: 1.01,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.08)",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25,
    },
  },
  tap: {
    scale: 0.98,
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
  }
}
