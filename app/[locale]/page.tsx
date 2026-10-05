import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { About } from "@/components/About/About";
import { ActionBar } from "@/components/ActionBar/ActionBar";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { Services } from "@/components/Services/Services";
import { getDictionary, toHeaderDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/i18n/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? buildMetadata(locale) : {};
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <Header locale={locale} dict={toHeaderDictionary(dict)} />
      <main id="top">
        <Hero dict={dict} />
        <Services dict={dict} />
        <About dict={dict} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
      <ActionBar dict={dict} />
    </>
  );
}
