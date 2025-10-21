import React from "react";
import ProductVetter from "../components/admin/ProductVetter";

export default function ProductVettingPage() {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 glow-text">
            Product Vetting Dashboard
          </h1>
          <p className="text-slate-300 text-lg">
            Add and review Amazon products for ingredient quality and safety
          </p>
        </div>

        <ProductVetter />

        <div className="mt-12 p-6 backdrop-blur-glass rounded-xl border border-amber-500/30">
          <h2 className="text-xl font-bold text-amber-300 mb-4">Ingredient Quality Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Look For (Good Ingredients):</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• Organic ingredients</li>
                <li>• Whole food sources</li>
                <li>• Natural preservatives</li>
                <li>• Third-party tested</li>
                <li>• Non-GMO verified</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-400 mb-2">Avoid (Harmful Ingredients):</h3>
              <ul className="text-slate-300 space-y-1">
                <li>• Artificial colors & flavors</li>
                <li>• High fructose corn syrup</li>
                <li>• Trans fats</li>
                <li>• BHA/BHT preservatives</li>
                <li>• Artificial sweeteners</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}