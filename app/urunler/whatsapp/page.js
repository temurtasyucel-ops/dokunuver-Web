import { getSiteContent } from "../../../lib/site-content-server";
import { productMetadata } from "../../../lib/product-page";
import { ProductPage } from "../../components/storefront/Storefront";
export const dynamic = "force-dynamic";
export async function generateMetadata() { return productMetadata("whatsapp"); }
export default async function Page() { return <ProductPage content={await getSiteContent()} id="whatsapp" />; }
