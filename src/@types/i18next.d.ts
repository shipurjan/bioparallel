import {
    i18nKeywords,
    i18nCursor,
    i18nMarking,
    i18nTooltip,
    i18nDescription,
} from "@/lib/locales/translation";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: ["keywords", "cursor", "marking", "tooltip", "description"];
        resources: {
            keywords: i18nKeywords;
            cursor: i18nCursor;
            marking: i18nMarking;
            tooltip: i18nTooltip;
            description: i18nDescription;
        };
    }
}
