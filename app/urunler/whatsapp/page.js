import { getSiteContent } from "../../../lib/site-content-server";
import { ProductPage } from "../../components/storefront/Storefront";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "WhatsApp NFC Kartı | DOKUNUVER",
  description:
    "DOKUNUVER WhatsApp NFC Kartı ile müşterilerinizin işletmenizle WhatsApp üzerinden NFC veya QR ile kolayca iletişime geçmesini sağlayın.",
};
export default async function Page() { return <ProductPage content={await getSiteContent()} id="whatsapp" />; }
