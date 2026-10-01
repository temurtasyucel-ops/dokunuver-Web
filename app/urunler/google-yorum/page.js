import { getSiteContent } from "../../../lib/site-content-server";
import { ProductPage } from "../../components/storefront/Storefront";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Google Yorum NFC | DOKUNUVER",
  description:
    "DOKUNUVER Google Yorum NFC ile müşterilerinizi NFC veya QR üzerinden işletmenizin Google yorum sayfasına kolayca yönlendirin.",
};
export default async function Page() { return <ProductPage content={await getSiteContent()} id="google-yorum" />; }
