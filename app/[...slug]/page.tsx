// app/[...slug]/page.js

import LandingPage from "../_components/LandingPage";

export default function CatchAllPage({ params }: any) {
  // params.slug will contain the path segments
  // e.g., for "/reddit/programming", params.slug = ["reddit", "programming"]

  const source = params.slug[0]; // e.g., "reddit"
  const details = params.slug.slice(1).join("/"); // e.g., "programming"

  // You can use these values for analytics or customization
  console.log(`User came from: ${source}, details: ${details}`);

  // Return the same component as the root page
  return <LandingPage source={source} details={details} />;
}
