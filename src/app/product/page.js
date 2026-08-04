import { redirect } from "next/navigation";

/**
 * The product page is now the site's home page. This route stays so existing
 * /product links keep working, and sends visitors to the canonical URL.
 */
export default function ProductPage() {
  redirect("/");
}
