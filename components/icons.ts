import type { IconType } from "react-icons";
import {
  FaBuilding,
  FaCalculator,
  FaChartLine,
  FaFacebookF,
  FaInstagram,
  FaLaptopCode,
  FaLinkedinIn,
  FaPassport,
  FaTelegram,
  FaUserTie,
  FaViber,
  FaWhatsapp,
} from "react-icons/fa6";
import type { MessengerId, ServiceId } from "@/lib/site";

export const serviceIcons: Record<ServiceId, IconType> = {
  company: FaBuilding,
  entrepreneur: FaUserTie,
  virtualZone: FaLaptopCode,
  accounting: FaCalculator,
  cfo: FaChartLine,
  workPermit: FaPassport,
};

export const messengerIcons: Record<MessengerId, IconType> = {
  telegram: FaTelegram,
  whatsapp: FaWhatsapp,
  viber: FaViber,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  linkedin: FaLinkedinIn,
};

/** Display names of the messenger / social channels (brand names, not translated). */
export const messengerNames: Record<MessengerId, string> = {
  telegram: "Telegram",
  whatsapp: "WhatsApp",
  viber: "Viber",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};
