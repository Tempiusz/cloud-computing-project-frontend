//import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="px-6 py-12 flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
      <div className="max-w-lg">
        <h1 className="text-xl font-bold mb-2">Welcome to ClothCloud</h1>
        <p className="mb-4">
          Your Clothing & Accessories Exchange Platform
          <br />
          Got clothes you no longer wear? Looking for something new without
          spending a dime?
        </p>

        <h2 className="font-medium mb-2">How it works:</h2>
        <ol className="list-decimal list-inside space-y-1 mb-6 text-base">
          <li>
            Add your items – take a photo, write a short description, and upload
            it to your "cloud".
          </li>
          <li>
            Browse listings – discover pieces from other users that match your
            style.
          </li>
          <li>Swap – quick, secure, and hassle-free exchanges.</li>
        </ol>
      </div>

      <div className="h-30 md:h-50">
        <img
          src="/roblox1.png"
          alt="Preview of clothing items available for swap"
          className="h-80"
        />
      </div>
    </section>
  );
}
