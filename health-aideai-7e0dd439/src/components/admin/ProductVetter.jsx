import React, { useState } from "react";
import { Product } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Check, X, AlertTriangle } from "lucide-react";

const HARMFUL_INGREDIENTS = [
  "artificial colors", "artificial flavors", "high fructose corn syrup", 
  "trans fats", "BHA", "BHT", "sodium benzoate", "artificial sweeteners",
  "titanium dioxide", "carrageenan", "sodium nitrite", "potassium bromate",
  "propyl gallate", "TBHQ", "sulfites", "MSG", "partially hydrogenated oils"
];

export default function ProductVetter() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    asin: "",
    category: "",
    subcategory: "",
    price: "",
    ingredients: [],
    harmful_ingredients: [],
    certifications: [],
    benefits: [],
    ingredient_quality: "",
    vetting_notes: "",
    vetted: false
  });
  
  const [newIngredient, setNewIngredient] = useState("");
  const [newBenefit, setNewBenefit] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => {
    if (newIngredient.trim()) {
      const isHarmful = HARMFUL_INGREDIENTS.some(harmful => 
        newIngredient.toLowerCase().includes(harmful.toLowerCase())
      );
      
      if (isHarmful) {
        setProductData(prev => ({
          ...prev,
          harmful_ingredients: [...prev.harmful_ingredients, newIngredient.trim()]
        }));
      } else {
        setProductData(prev => ({
          ...prev,
          ingredients: [...prev.ingredients, newIngredient.trim()]
        }));
      }
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredient, isHarmful = false) => {
    if (isHarmful) {
      setProductData(prev => ({
        ...prev,
        harmful_ingredients: prev.harmful_ingredients.filter(ing => ing !== ingredient)
      }));
    } else {
      setProductData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter(ing => ing !== ingredient)
      }));
    }
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setProductData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit("");
    }
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setProductData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification("");
    }
  };

  const assessQuality = () => {
    const harmfulCount = productData.harmful_ingredients.length;
    const certCount = productData.certifications.length;
    
    if (harmfulCount > 2) return "poor";
    if (harmfulCount > 0) return "fair";
    if (certCount > 2) return "excellent";
    return "good";
  };

  const submitProduct = async () => {
    setIsSubmitting(true);
    try {
      const quality = assessQuality();
      await Product.create({
        ...productData,
        price: parseFloat(productData.price),
        affiliate_provider: "amazon",
        ingredient_quality: quality,
        vetted: true,
        featured: quality === "excellent"
      });
      
      // Reset form
      setProductData({
        name: "", description: "", asin: "", category: "", subcategory: "",
        price: "", ingredients: [], harmful_ingredients: [], certifications: [],
        benefits: [], ingredient_quality: "", vetting_notes: "", vetted: false
      });
      
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const qualityColor = {
    excellent: "bg-green-100 text-green-800",
    good: "bg-blue-100 text-blue-800", 
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-red-100 text-red-800"
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="backdrop-blur-glass neon-border">
        <CardHeader>
          <CardTitle className="text-white">Product Vetting System</CardTitle>
          <p className="text-slate-300">Add and vet Amazon products for ingredient quality</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Product Name"
              value={productData.name}
              onChange={(e) => setProductData({...productData, name: e.target.value})}
              className="bg-slate-800/50 border-cyan-500/30 text-white"
            />
            <Input
              placeholder="Amazon ASIN"
              value={productData.asin}
              onChange={(e) => setProductData({...productData, asin: e.target.value})}
              className="bg-slate-800/50 border-cyan-500/30 text-white"
            />
            <Select value={productData.category} onValueChange={(value) => setProductData({...productData, category: value})}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="supplements">Supplements</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="devices">Devices</SelectItem>
                <SelectItem value="personal_care">Personal Care</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Price ($)"
              type="number"
              value={productData.price}
              onChange={(e) => setProductData({...productData, price: e.target.value})}
              className="bg-slate-800/50 border-cyan-500/30 text-white"
            />
          </div>

          <Textarea
            placeholder="Product Description"
            value={productData.description}
            onChange={(e) => setProductData({...productData, description: e.target.value})}
            className="bg-slate-800/50 border-cyan-500/30 text-white"
          />

          {/* Ingredients Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Ingredients Analysis</h3>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add ingredient..."
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                className="flex-1 bg-slate-800/50 border-cyan-500/30 text-white"
              />
              <Button onClick={addIngredient} className="bg-gradient-to-r from-cyan-500 to-emerald-500">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {productData.ingredients.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-green-400 mb-2">Good Ingredients:</h4>
                <div className="flex flex-wrap gap-2">
                  {productData.ingredients.map((ingredient, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800 cursor-pointer" 
                           onClick={() => removeIngredient(ingredient)}>
                      {ingredient} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {productData.harmful_ingredients.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-2">Harmful Ingredients Found:</h4>
                <div className="flex flex-wrap gap-2">
                  {productData.harmful_ingredients.map((ingredient, i) => (
                    <Badge key={i} className="bg-red-100 text-red-800 cursor-pointer"
                           onClick={() => removeIngredient(ingredient, true)}>
                      {ingredient} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quality Assessment */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">Ingredient Quality:</span>
              <Badge className={qualityColor[assessQuality()]}>
                {assessQuality().toUpperCase()}
              </Badge>
            </div>
            {productData.harmful_ingredients.length > 0 && (
              <Alert className="border-red-500/50 bg-red-500/10 mt-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-200">
                  This product contains potentially harmful ingredients and may not meet quality standards.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <Textarea
            placeholder="Vetting notes..."
            value={productData.vetting_notes}
            onChange={(e) => setProductData({...productData, vetting_notes: e.target.value})}
            className="bg-slate-800/50 border-cyan-500/30 text-white"
          />

          <Button 
            onClick={submitProduct}
            disabled={isSubmitting || !productData.name || !productData.asin || assessQuality() === "poor"}
            className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600"
          >
            {isSubmitting ? "Adding Product..." : "Add Vetted Product"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}