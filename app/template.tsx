"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // We don't want to animate the dashboard wrapper itself when navigating inside it.
  // The dashboard has its own template.tsx for internal transitions.
  if (pathname.startsWith("/dashboard")) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="min-h-full flex flex-col flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
