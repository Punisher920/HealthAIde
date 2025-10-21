
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingBag, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const AMAZON_ASSOCIATE_ID = "healthaide0b-20";

export default function FeaturedProducts({ products, loading }) {
  if (loading) {
    return (
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="backdrop-blur-glass">
                <CardContent className="p-6">
                  <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text">
            Featured Health Products
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Carefully curated products recommended by Nouri for optimal health and wellness
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => {
            let productUrl = product.affiliate_link;
            if (product.affiliate_provider === 'amazon' && product.asin) {
              productUrl = `https://www.amazon.com/dp/${product.asin}/?tag=${AMAZON_ASSOCIATE_ID}`;
            }

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="backdrop-blur-glass neon-border h-full hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                        Featured
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                        {product.category}
                      </Badge>
                      {product.subcategory && (
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-300">
                          {product.subcategory.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < (product.rating || 5)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-slate-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-400">
                          ({product.rating || 5}.0)
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-400">
                        ${product.price}
                      </span>
                    </div>

                    <a
                      href={productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white font-medium">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        View Product
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to={createPageUrl("Store")}>
            <Button variant="outline" size="lg" className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 px-8 py-4 rounded-xl">
              View All Products
              <ShoppingBag className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
