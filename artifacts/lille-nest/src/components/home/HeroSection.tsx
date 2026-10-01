import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';
import { content } from '@/data/content';
import { categories } from '@/data/products';

export function HeroSection() {
  const { hero } = content;

  return (
    <section className="relative hero-gradient overflow-hidden">
      <div className="container py-12 md:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase mb-6">
              <Sparkles className="h-4 w-4" />
              <span>{hero.badge}</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal text-foreground leading-[1.15] tracking-tight mb-6">
              {hero.titleStart}<span className="italic text-primary font-normal">{hero.titleHighlight}</span>
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 font-body leading-relaxed">
              {hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-base">
                <Link to="/products">
                  {hero.primaryCta}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-primary/20 text-foreground hover:bg-card text-base">
                <Link
                  to={
                    categories[0]
                      ? `/products?category=${categories[0].slug}`
                      : "/products"
                  }
                >
                  {categories[0]?.name ?? "Shop by category"}
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 text-xs md:text-sm text-muted-foreground">
              <span className="flex items-center gap-2 font-medium">
                <Leaf className="h-4 w-4 text-secondary" /> {hero.badges[0].text}
              </span>
              <span className="flex items-center gap-2 font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" /> {hero.badges[1].text}
              </span>
              <span className="flex items-center gap-2 font-medium">
                <HeartHandshake className="h-4 w-4 text-secondary" /> {hero.badges[2].text}
              </span>
            </div>
          </div>

          {/* Hero Visual - Editorial Stitch Images */}
          <div className="relative px-2 md:px-0">
            <div className="relative rounded-2xl overflow-hidden shadow-float border border-primary/10 bg-card p-3 md:p-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img 
                  src="/images/stitch/hero-children-loungewear.jpg" 
                  alt="Lille & Nest Organic Children Loungewear" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Tag */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md px-4 py-3 rounded-xl border border-primary/10 shadow-soft max-w-xs">
                  <span className="text-[10px] font-semibold tracking-widest text-primary uppercase block mb-1">
                    {hero.floatingTag.subtitle}
                  </span>
                  <p className="font-display font-medium text-sm text-foreground">
                    {hero.floatingTag.title}
                  </p>
                </div>
              </div>

              {/* Inset Secondary Stitch Image */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 md:w-44 md:h-44 rounded-xl overflow-hidden border-4 border-background shadow-card hidden sm:block">
                <img 
                  src="/images/stitch/briefs-flatlay-editorial.jpg" 
                  alt="Organic Briefs Flatlay" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
