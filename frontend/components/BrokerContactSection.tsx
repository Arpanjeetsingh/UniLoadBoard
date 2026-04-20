import { Phone, Mail, Building2, Hash } from "lucide-react";
import type { BrokerContact } from "@/lib/types";

interface BrokerContactSectionProps {
  broker: BrokerContact;
}

export function BrokerContactSection({ broker }: BrokerContactSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <h3 className="font-semibold text-base text-foreground">Broker Contact</h3>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Building2 className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div>
            <p className="text-sm font-medium text-foreground">{broker.company_name}</p>
            {broker.contact_name && (
              <p className="text-sm text-muted-foreground">{broker.contact_name}</p>
            )}
          </div>
        </div>

        {broker.mc_number && (
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-mono text-foreground">{broker.mc_number}</span>
          </div>
        )}

        {broker.phone && (
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <a
              href={`tel:${broker.phone.replace(/\D/g, "")}`}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              {broker.phone}
            </a>
          </div>
        )}

        {broker.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <a
              href={`mailto:${broker.email}`}
              className="text-sm text-blue-600 hover:underline"
            >
              {broker.email}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
