"use client"

import { motion, type Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Linkedin, Twitter, Facebook } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

export default function Footer() {
  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ]

  const companyLinks = [
    { name: "Services", href: "/services" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Sourcing Guides", href: "/guides" },
    { name: "Track Order", href: "/track" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ]

  return (
    <footer className="bg-secondary text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="py-16 md:py-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Company Info Section */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Link href="/" className="mb-5 inline-block">
                <Image
                  src="/image.png"
                  alt="Kaiz La Logo"
                  width={150}
                  height={80}
                  className="h-auto w-auto transition-transform duration-300 hover:scale-105"
                  priority
                />
              </Link>
              <p className="text-lg text-background/90 leading-relaxed mb-8 max-w-lg">
                Your trusted partner in global sourcing, simplifying supply chains with expertise and technology.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 bg-background rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Company Links Section */}
            <motion.div variants={itemVariants}>
              <h4 className="text-xl font-bold text-background mb-6">Company</h4>
              <ul className="space-y-4">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base font-medium text-background/90 hover:text-white hover:underline transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom Copyright Section */}
          <motion.div 
            variants={itemVariants} 
            className="mt-16 pt-8 border-t border-background"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-y-4 gap-x-6 text-base text-background/90">
              <p>© {new Date().getFullYear()} Kaiz La. All Rights Reserved.</p>
              <div className="flex items-center gap-x-4">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span className="text-background/90">|</span>
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
