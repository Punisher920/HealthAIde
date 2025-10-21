
import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingBag, Search, Filter, Star, ExternalLink, AlertTriangle, RefreshCw, HelpCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { checkInteractions } from "@/api/functions"; // New import for NIH API

import InteractionChecker from "../components/safety/InteractionChecker";
import ProductAIExplain from "../components/store/ProductAIExplain"; // New import for AI explanation

const AMAZON_ASSOCIATE_ID = "healthaide0b-20";

// Remove the static INTERACTION_DATABASE, as we are now using an external API

/**
 * ProductInteractionCheck Component
 * Fetches and displays interaction information for a specific product and user's medications.
 */
function ProductInteractionCheck({ product, medications, onResult }) {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleCheck = async () => {
        setIsLoading(true);
        setResult(null); // Clear previous result
        try {
            // Use product name as a fallback if no ingredients are listed
            const productIngredients = product.ingredients && product.ingredients.length > 0 ? product.ingredients : [product.name];
            const substances = [...medications, ...productIngredients];

            // Call the external checkInteractions function
            const response = await checkInteractions({ substances });
            
            // Filter interactions to ensure they involve both a medication AND a product ingredient
            const interactions = response.data.interactions.filter(
                inter => medications.some(med => inter.substances.map(s => s.toLowerCase()).includes(med.toLowerCase())) &&
                       productIngredients.some(ing => inter.substances.map(s => s.toLowerCase()).includes(ing.toLowerCase()))
            );
            
            setResult({ interactions });
            onResult(product.id, { interactions }); // Pass result back to parent component
        } catch (error) {
            console.error("Interaction check failed for product:", product.name, error);
            setResult({ error: "Could not perform check." });
            onResult(product.id, { error: "Could not perform check." }); // Pass error back
        } finally {
            setIsLoading(false);
        }
    };

    const hasInteractions = result && result.interactions && result.interactions.length > 0;
    const highestSeverity = hasInteractions ? result.interactions.reduce((max, inter) => {
        // Assuming severity levels from NIH API are 'low', 'moderate', 'high'
        const severityOrder = { 'low': 1, 'moderate': 2, 'high': 3 };
        return Math.max(max, severityOrder[inter.severity] || 0);
    }, 0) : 0;
    
    let severityLabel = null;
    if(highestSeverity === 3) severityLabel = { text: 'Major Risk', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    if(highestSeverity === 2) severityLabel = { text: 'Moderate Risk', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' };
    // Minor/low interactions don't change the card's styling or button, so no specific severityLabel for them here.

    return (
        <div className="mt-4">
            <Button 
                onClick={handleCheck} 
                disabled={isLoading || medications.length === 0} // Disable if loading or no medications entered
                variant="outline" 
                className="w-full border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <AlertTriangle className="w-4 h-4 mr-2" />}
                {medications.length === 0 ? "Add Medications to Check" : "Check Product Interactions"}
            </Button>
            
            {result && !isLoading && (
                <div className="mt-2">
                    {result.error ? (
                        // Display error if check failed
                        <Alert className="bg-red-500/10 text-red-300 border-red-500/30">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                {result.error} Please try again.
                            </AlertDescription>
                        </Alert>
                    ) : hasInteractions ? (
                        // Display interaction found with severity
                         <Alert className={severityLabel ? severityLabel.color : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'}>
                           <AlertTriangle className="h-4 w-4" />
                           <AlertDescription>
                             <strong className="block">{severityLabel ? severityLabel.text : 'Interaction Found'}</strong>
                             {result.interactions[0].description} {result.interactions.length > 1 && `(and ${result.interactions.length - 1} more)`}
                           </AlertDescription>
                         </Alert>
                    ) : (
                        // No direct interactions found
                         <Alert className="bg-green-500/10 text-green-300 border-green-500/30">
                            <AlertDescription>No direct interactions found.</AlertDescription>
                         </Alert>
                    )}
                </div>
            )}
        </div>
    );
}

export default function StorePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showInteractionChecker, setShowInteractionChecker] = useState(false);
  const [currentMedications, setCurrentMedications] = useState([]);
  // New state to store interaction results for each product, mapping product ID to its interaction data
  const [interactionResults, setInteractionResults] = useState({}); 

  useEffect(() => {
    loadProducts();
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filters
    if (categoryFilter !== "all") {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    if (subcategoryFilter !== "all") {
      filtered = filtered.filter(product => product.subcategory === subcategoryFilter);
    }
    
    // Removed old medication interaction filter logic (products are no longer hidden globally)

    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, subcategoryFilter]);

  useEffect(() => {
    filterProducts();
  }, [filterProducts]); 

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await Product.list('-created_date');
      setProducts(data);
      setFilteredProducts(data); // Initialize filtered products with all products
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Removed the old checkProductInteractions function

  const handleMedicationsChange = (medications) => {
    setCurrentMedications(medications);
    // Reset all product interaction results when medications list changes
    setInteractionResults({}); 
  };

  // Callback to update interaction results from ProductInteractionCheck component
  const handleInteractionResult = (productId, result) => {
    setInteractionResults(prev => ({...prev, [productId]: result}));
  };

  const clearAllFilters = () => {
    setCurrentMedications([]);
    setInteractionResults({}); // Reset interaction results
    setSearchTerm("");
    setCategoryFilter("all");
    setSubcategoryFilter("all");
    // Removed setShowHiddenProducts(false); as it's no longer used
  };

  // The filterProducts function is now wrapped in useCallback above the useEffect hooks

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const subcategories = [...new Set(products.map(p => p.subcategory).filter(Boolean))];

  // Removed totalExcluded and totalFlagged as they are not used for overall summary anymore

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text">
            Health Store
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Carefully curated health products recommended by Nouri for optimal wellness
          </p>
        </motion.div>

        {/* Safety Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-glass neon-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                  Drug Interaction Checker
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowInteractionChecker(!showInteractionChecker)}
                    className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    {showInteractionChecker ? 'Hide' : 'Open'} Checker
                  </Button>
                </div>
              </div>
              
              <Alert className="border-amber-500/50 bg-amber-500/10 mb-4">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-200">
                  Powered by the U.S. National Institutes of Health (NIH). Add your medications, then check individual products for potential interactions.
                </AlertDescription>
              </Alert>

              <AnimatePresence>
                {showInteractionChecker && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <InteractionChecker onMedicationsChange={handleMedicationsChange} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Display active medications, but removed the old safety filter summary */}
              {currentMedications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 space-y-3"
                >
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-300 font-medium">
                        Active Medications: {currentMedications.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentMedications.map((med, index) => (
                        <Badge key={index} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {med}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-blue-200 mt-2">
                       (Individual products need to be checked for interactions below.)
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <Card className="backdrop-blur-glass neon-border">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-cyan-500/30 text-white"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category ? category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
                  <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                    <SelectValue placeholder="All Subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subcategories</SelectItem>
                    {subcategories.map(subcategory => (
                      <SelectItem key={subcategory} value={subcategory}>
                        {subcategory ? subcategory.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={clearAllFilters}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredProducts.map((product, index) => {
              // Get the interaction result for this specific product from state
              const productInteractionResult = interactionResults[product.id];
              // Determine if there's a major interaction (severity 'high')
              const hasMajorInteraction = productInteractionResult?.interactions?.some(i => i.severity === 'high');

              let productUrl = product.affiliate_link;
              if (product.affiliate_provider === 'amazon' && product.asin) {
                productUrl = `https://www.amazon.com/dp/${product.asin}/?tag=${AMAZON_ASSOCIATE_ID}`;
              }

              return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`backdrop-blur-glass neon-border h-full hover:shadow-lg transition-all duration-300 group ${
                  hasMajorInteraction ? 'border-red-500/50 bg-red-500/5' : 
                  'hover:shadow-cyan-500/20'
                }`}>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="relative mb-4">
                      <img
                        src={product.image_url || "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      {product.featured && (
                        <Badge className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white">
                          Featured
                        </Badge>
                      )}
                      {/* Removed old major/moderate interaction badges as they are now handled by ProductInteractionCheck component */}
                    </div>

                    {/* Removed old Alert for interactions as it's now handled by ProductInteractionCheck component */}

                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
                        {product.category}
                      </Badge>
                      {product.subcategory && (
                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-300">
                          {product.subcategory?.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {product.benefits && product.benefits.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2">Key Benefits:</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.benefits.slice(0, 2).map((benefit, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-emerald-500/30 text-emerald-300">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
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
                      <span className="text-2xl font-bold text-emerald-400">
                        ${product.price}
                      </span>
                    </div>
                    
                    <div className="mt-auto">
                      {/* Claude-powered product Q&A */}
                      <ProductAIExplain product={product} medications={currentMedications} />

                      {/* Existing interaction check */}
                      {currentMedications.length > 0 && (
                        <ProductInteractionCheck 
                          product={product} 
                          medications={currentMedications} 
                          onResult={handleInteractionResult}
                        />
                      )}

                      <a
                        href={productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2"
                      >
                        <Button 
                          className={`w-full font-medium ${
                            hasMajorInteraction 
                              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600'
                          } text-white`}
                          disabled={hasMajorInteraction}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          {hasMajorInteraction ? 'Major Risk - Do Not Use' : 'View Product'}
                          {!hasMajorInteraction && <ExternalLink className="w-4 h-4 ml-2" />}
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Adjust "No Products Found" message as products are no longer globally hidden */}
        {filteredProducts.length === 0 && !loading && (
          <Card className="backdrop-blur-glass neon-border">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-slate-500" />
              <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
              <p className="text-slate-300 mb-4">
                Try adjusting your search criteria or filters.
              </p>
                <Button
                  onClick={clearAllFilters}
                  className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear All Filters
                </Button>
            </CardContent>
          </Card>
        )}

        {/* Legal Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 p-6 backdrop-blur-glass rounded-xl border border-amber-500/30"
        >
          <div className="text-center space-y-3">
            <p className="text-sm text-amber-300">
              <span className="font-semibold">FDA Disclaimer:</span> These statements have not been evaluated by the Food and Drug Administration. 
              These products are not intended to diagnose, treat, cure, or prevent any disease.
            </p>
            <p className="text-sm text-slate-400">
              <span className="font-semibold">Affiliate Disclosure:</span> As an Amazon Associate, we earn from qualifying purchases. 
              This helps support our platform at no additional cost to you.
            </p>
            <p className="text-sm text-red-300">
              <span className="font-semibold">Drug Interaction Warning:</span> The interaction checker provides general guidance only. 
              Always consult your healthcare provider before starting any new supplement, especially if you take prescription medications.
              This tool is powered by the U.S. National Institutes of Health (NIH) data.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
