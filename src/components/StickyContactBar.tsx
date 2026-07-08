"use client";

import { buildWhatsAppLink } from "@/lib/constants";

type Props = {
  phone: string;
  year: number;
  make: string;
  model: string;
};

export default function StickyContactBar({ phone, year, make, model }: Props) {
  const whatsAppUrl = buildWhatsAppLink(
    phone,
    `Hi, is the ${year} ${make} ${model} still available?`
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] lg:hidden">
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="block rounded-lg bg-slate-900 py-3 text-center text-sm font-semibold text-white"
        >
          📞 Call seller
        </a>
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
            <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.2-.6.9-.8 1.1-.1.2-.3.2-.5.1-1.4-.6-2.3-1.3-3.2-2.8-.1-.2-.1-.4.1-.6.2-.2.5-.5.6-.7.1-.2.1-.4 0-.6-.1-.2-.6-1.5-.8-2-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.1 2.3.9 2.8.7 3.3.6.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.2-.2-.2-.4-.3Z" />
            <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .9.9-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Z" />
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}
