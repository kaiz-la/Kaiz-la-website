"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
    { id: 1, name: "Priya Patel", content: "Their sourcing expertise is simply unparalleled. They streamlined our entire supply chain, delivering quality products ahead of schedule.", rating: 5, },
    { id: 2, name: "Rohan Sharma", content: "The attention to detail is remarkable. From vetting suppliers to final logistics, every step was handled with absolute precision.", rating: 5, },
    { id: 3, name: "Anjali Mehta", content: "A true game-changer for our expansion efforts. Their deep market understanding helped us navigate complex trade routes with ease.", rating: 5, },
    { id: 4, name: "Vikram Singh", content: "The level of transparency is fantastic. Real-time tracking and clear communication gave us complete control over our inventory.", rating: 5, },
    { id: 5, name: "Isha Reddy", content: "They made international trade compliance feel effortless. The documentation and customs support saved us countless hours.", rating: 5, },
    { id: 6, name: "Arjun Desai", content: "Working with them felt like a true partnership. Their team is responsive, knowledgeable, and genuinely invested in our success.", rating: 5, },
    { id: 7, name: "Sneha Joshi", content: "Exceptional service from start to finish. They consistently secure competitive pricing without ever compromising on quality.", rating: 5, },
    { id: 8, name: "Karan Malhotra", content: "Their platform is intuitive and powerful. Managing our global sourcing has never been more efficient or straightforward.", rating: 5, },
    { id: 9, name: "Diya Kumar", content: "The quality assurance process is incredibly thorough. We trust them to deliver products that meet the highest standards every time.", rating: 5, },
    { id: 10, name: "Aditya Gupta", content: "They have fundamentally transformed our procurement strategy for the better. We consider them an indispensable part of our team.", rating: 5, }
];

export default function Testimonials() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextTestimonial = useCallback(() => {
        setDirection(1);
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prevTestimonial = useCallback(() => {
        setDirection(-1);
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    const handleDotClick = (index: number) => {
        setDirection(index > currentTestimonial ? 1 : -1);
        setCurrentTestimonial(index);
    };

    useEffect(() => {
        const timer = setInterval(nextTestimonial, 7000);
        return () => clearInterval(timer);
    }, [nextTestimonial]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 10;
        if (info.offset.x > swipeThreshold) {
            prevTestimonial();
        } else if (info.offset.x < -swipeThreshold) {
            nextTestimonial();
        }
    };

    const getVisibleTestimonials = () => {
        const visible = [];
        const len = testimonials.length;
        for (let i = -1; i <= 1; i++) {
            const index = (currentTestimonial + i + len) % len;
            visible.push({ ...testimonials[index], position: i });
        }
        return visible;
    };

    const renderStars = (rating: number, isActive: boolean) => (
        Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-4 w-4 transition-colors ${i < rating
                    ? (isActive ? "text-white fill-white" : "text-gold fill-gold")
                    : (isActive ? "text-white/30" : "text-ink/15")
                    }`}
            />
        ))
    );

    const sliderVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0, }),
        center: { x: '0%', opacity: 1, zIndex: 1, },
        exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0, zIndex: 0, }),
    };

    return (
        <section className="relative grain overflow-hidden bg-porcelain-deep py-24 lg:py-32">
            {/* Ambient brand glows */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(42% 30% at 12% 6%, rgba(204,52,51,0.07), transparent 70%), radial-gradient(40% 30% at 90% 96%, rgba(224,137,46,0.08), transparent 70%)",
                }}
            />

            <div className="relative z-10 container mx-auto px-5 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto mb-16 max-w-2xl text-center lg:mb-20"
                >
                    <div className="flex items-center justify-center gap-3">
                        <span className="h-px w-8 bg-gold" />
                        <span className="eyebrow text-ink/60">In their words</span>
                        <span className="h-px w-8 bg-gold" />
                    </div>
                    <h2 className="mt-5 font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl lg:text-6xl">
                        What our clients <span className="text-gradient-crimson italic">say.</span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
                        Businesses across India and the Middle East trust Kaiz La to turn China
                        sourcing from a gamble into a routine. Here&apos;s what that feels like.
                    </p>
                </motion.div>

                {/* Slider */}
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={prevTestimonial}
                        className="absolute left-0 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-border bg-paper text-crimson shadow-sm transition-all duration-300 hover:scale-110 hover:bg-crimson hover:text-white active:scale-95 md:flex"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <div className="relative h-[26rem] w-full max-w-sm overflow-hidden sm:h-[24rem] md:max-w-6xl">
                        <AnimatePresence initial={false} custom={direction}>
                            <motion.div
                                key={currentTestimonial}
                                variants={sliderVariants}
                                custom={direction}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                onDragEnd={handleDragEnd}
                                className="absolute h-full w-full cursor-grab active:cursor-grabbing"
                            >
                                <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
                                    {getVisibleTestimonials().map((testimonial) => {
                                        const isActive = testimonial.position === 0;
                                        return (
                                            <div
                                                key={testimonial.id}
                                                className={`relative flex h-full flex-col rounded-3xl p-7 transition-all duration-500 ease-in-out sm:p-8
                            ${isActive
                                                        ? "bg-crimson text-white shadow-[0_30px_60px_-24px_rgba(204,52,51,0.55)]"
                                                        : "card-lux text-ink"}
                            ${!isActive && "hidden md:flex"}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <Quote
                                                        className={`h-10 w-10 ${isActive ? "text-white/30" : "text-crimson/15"}`}
                                                        strokeWidth={1.5}
                                                    />
                                                    <div className="flex gap-0.5">{renderStars(testimonial.rating, isActive)}</div>
                                                </div>

                                                <p className={`mt-5 flex-grow font-display text-lg leading-relaxed ${isActive ? "text-white/95" : "text-ink-soft"}`}>
                                                    {testimonial.content}
                                                </p>

                                                <div
                                                    className={`mt-6 h-px w-12 ${isActive ? "bg-white/30" : "rule-gold"}`}
                                                />

                                                <div className="mt-5 flex items-end justify-between">
                                                    <div className={`font-display text-lg ${isActive ? "text-white" : "text-ink"}`}>
                                                        {testimonial.name}
                                                    </div>
                                                    <div className={`eyebrow ${isActive ? "text-white/55" : "text-gold"}`}>
                                                        {String(testimonial.id).padStart(2, "0")}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={nextTestimonial}
                        className="absolute right-0 z-20 hidden h-12 w-12 items-center justify-center rounded-full border border-border bg-paper text-crimson shadow-sm transition-all duration-300 hover:scale-110 hover:bg-crimson hover:text-white active:scale-95 md:flex"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    <div className="absolute -bottom-12 flex w-full max-w-xs justify-between md:hidden">
                        <button onClick={prevTestimonial} className="rounded-full border border-border bg-paper p-2 text-crimson shadow-sm" aria-label="Previous testimonial"><ChevronLeft /></button>
                        <button onClick={nextTestimonial} className="rounded-full border border-border bg-paper p-2 text-crimson shadow-sm" aria-label="Next testimonial"><ChevronRight /></button>
                    </div>
                </div>

                {/* Dots */}
                <div className="mt-20 flex justify-center gap-2.5 md:mt-12">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => handleDotClick(index)}
                            className={`h-2 rounded-full transition-all duration-300 ease-in-out
                  ${index === currentTestimonial ? "w-6 bg-crimson" : "w-2 bg-ink/15 hover:bg-ink/30"}`}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
