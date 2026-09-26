import type { institucional as Source } from "../pt/institucional";

// Namespace "institucional" — pl. Tem de cumprir a forma do português.
export const institucional: typeof Source = {
  sobre: {
    metadata: {
      title: "O nas",
      description:
        "EvDigital to firma IT. Budujemy obecność w sieci dla tych, którzy jeszcze jej nie mają, oraz rozwiązania szyte na miarę dla tych, którzy potrzebują już czegoś więcej niż strony internetowej.",
    },
    eyebrow: "Kim jesteśmy",
    title: "EvDigital to firma IT.",
    intro:
      "Budujemy obecność w sieci dla tych, którzy jeszcze jej nie mają, oraz rozwiązania szyte na miarę dla tych, którzy potrzebują już czegoś więcej niż strony internetowej.",
    whyTitle: "Dlaczego istniejemy",
    whyLead: "Miliony małych firm wciąż nie istnieją w internecie.",
    whyP1:
      "Nie z braku chęci. Technologia jest wciąż tłumaczona językiem, który wyklucza tych, którzy potrzebują jej najbardziej.",
    whyP2:
      "Stworzyliśmy EvDigital, aby rozwiązać oba końce tego samego problemu: dla tych, którzy jeszcze nie zrobili pierwszego kroku, i dla tych, którzy chcą już zrobić kolejny.",
    howTitle: "Jak pracujemy",
    how: [
      "Najpierw wyjaśniamy, potem robimy.",
      "Mówimy, czego nie warto robić.",
      "Nie znikamy po wdrożeniu.",
    ],
    ctaAria: "Skontaktuj się",
    ctaText:
      "Bez zobowiązań, aby zrozumieć, gdzie Państwo są i co warto zrobić dalej.",
    ctaButton: "Skontaktuj się",
  },
  legal: {
    updatedPrefix: "Ostatnia aktualizacja:",
  },
  privacidade: {
    metadata: {
      title: "Polityka prywatności",
      description:
        "Jak EvDigital przetwarza dane osobowe zbierane na stronie internetowej i w Strefie Klienta.",
    },
    title: "Polityka prywatności",
    updatedAt: "24 września 2026",
    intro:
      "Ta strona wyjaśnia, jakie dane zbieramy, gdy korzystają Państwo z tej strony internetowej lub ze swojej Strefy Klienta, do czego służą, jak długo je przechowujemy i czego mogą Państwo w związku z nimi żądać.",
    controller: {
      title: "Kto przetwarza Państwa dane",
      p1: "EvDigital jest administratorem danych zbieranych na tej stronie i w Strefie Klienta. W razie jakichkolwiek pytań dotyczących niniejszej polityki lub Państwa danych prosimy skorzystać z formularza na stronie kontaktowej. Jeśli mają Państwo już konto, mogą Państwo także napisać do nas w zgłoszeniu w swojej Strefie Klienta.",
    },
    data: {
      title: "Jakie dane zbieramy",
      intro: "Zależy to od tego, co Państwo robią na stronie.",
      groups: [
        {
          title: "Gdy kontaktują się Państwo z nami",
          items: [
            "Imię i nazwisko",
            "Adres e-mail",
            "Numer telefonu, jeśli zdecydują się Państwo go podać (jest opcjonalny)",
            "Czego Państwo potrzebują, wybrane z listy",
            "Treść wiadomości",
            "Jeśli umówią się Państwo na spotkanie, wybrany dzień i godzinę",
          ],
        },
        {
          title: "Gdy zakładają Państwo konto w Strefie Klienta",
          items: [
            "Imię i nazwisko oraz adres e-mail",
            "Hasło (przechowujemy wyłącznie jego zaszyfrowaną wersję, nigdy samo hasło)",
            "Numer telefonu, nazwę firmy i NIP, jeśli zdecydują się Państwo je podać (są opcjonalne)",
            "Utworzone przez Państwa projekty i zgłoszenia oraz wiadomości, które Państwo z nami wymieniają",
          ],
        },
      ],
      google: {
        title: "Jeśli logują się Państwo przez Google",
        text: "Otrzymujemy od Google Państwa adres e-mail oraz imię i nazwisko. Nie otrzymujemy Państwa hasła do konta Google.",
      },
      outro:
        "Nie używamy reklamowych plików cookie, nie śledzimy Państwa między stronami oraz nie kupujemy ani nie sprzedajemy list kontaktów.",
    },
    cookies: {
      title: "Pliki cookie",
      p1: "Używamy plików cookie niezbędnych do działania strony: jeden zapamiętuje wybrany przez Państwa język, a w Strefie Klienta drugi utrzymuje Państwa sesję (do 30 dni lub do momentu wylogowania). Nie używamy reklamowych plików cookie.",
      p2: "Tylko za Państwa zgodą, wyrażoną w komunikacie o plikach cookie, używamy na stronie publicznej także Google Analytics 4, aby zrozumieć, jak strona jest używana (odwiedzane strony, źródło wizyt, rodzaj urządzenia). Jeśli Państwo odmówią, nic od Google nie jest ładowane. Zdanie można zmienić w dowolnym momencie w „Cookies” w stopce. Google może przetwarzać te dane poza Unią Europejską. W Strefie Klienta nie używamy analityki.",
    },
    purpose: {
      title: "Do czego służą",
      p1: "Służą wyłącznie do udzielenia odpowiedzi na Państwa zapytanie, do obsługi Państwa konta oraz, jeśli podejmiemy współpracę, do realizacji zleconej nam pracy. Przechowujemy także status kontaktów i zgłoszeń (na przykład informację, czy już Państwu odpowiedzieliśmy), aby lepiej się organizować.",
      p2Bold: "Nie zapisujemy Państwa do newsletterów ani kampanii.",
      p2Rest:
        " Jeśli kiedyś zechcemy wysyłać Państwu tego rodzaju komunikację, najpierw poprosimy o wyraźną zgodę, którą mogą Państwo w każdej chwili wycofać.",
    },
    basis: {
      title: "Podstawa prawna",
      text: "Przetwarzamy te dane w celu zrealizowania zapytania, które od Państwa pochodzi, oraz w celu świadczenia usługi Strefy Klienta (działania przed zawarciem umowy i wykonanie umowy, art. 6 ust. 1 lit. b) rozporządzenia o ochronie danych osobowych, RODO).",
    },
    retention: {
      title: "Jak długo",
      p1: "Kontakty, które nie zaowocowały pracą, przechowujemy przez 24 miesiące, po czym są usuwane. Jeśli będziemy z Państwem współpracować, dane pozostaną przez czas trwania relacji oraz przez okres wymagany przez prawo po jej zakończeniu.",
      p2: "Dane konta przechowujemy tak długo, jak istnieje konto. Jeśli zażądają Państwo usunięcia, usuniemy konto i powiązane z nim dane, z wyjątkiem tych, które prawo zobowiązuje nas przechowywać.",
      p3: "Mogą Państwo w każdej chwili zażądać usunięcia danych wcześniej. W Strefie Klienta można to zrobić w Ustawieniach, w zakładce Bezpieczeństwo.",
    },
    access: {
      title: "Kto ma dostęp",
      p1: "Wyłącznie EvDigital oraz usługi, z których korzystamy, aby strona działała: wysyłka e-maili, Cal.com, jeśli umówią się Państwo na spotkanie (otrzymuje Państwa imię i nazwisko, adres e-mail, strefę czasową i wybrany termin), oraz Google, jeśli logują się Państwo kontem Google. Dane znajdują się w naszej własnej bazie danych, a gdy się z nami kontaktują Państwo, są wysyłane e-mailem na nasz wewnętrzny adres.",
    },
    rights: {
      title: "Państwa prawa",
      p1: "Mogą Państwo w każdej chwili i bez podawania powodu zażądać od nas: dostępu do danych, które o Państwu posiadamy, ich sprostowania, usunięcia, ograniczenia ich przetwarzania, wniesienia sprzeciwu wobec przetwarzania lub otrzymania ich w formacie, który można przenieść gdzie indziej.",
      p2Before:
        "Wystarczy zgłosić to przez formularz kontaktowy lub, jeśli mają Państwo konto, w zgłoszeniu w Strefie Klienta. Odpowiadamy w ciągu jednego miesiąca. Jeśli uznają Państwo, że sprawa nie została załatwiona należycie, mogą Państwo złożyć skargę do portugalskiego organu ochrony danych, Comissão Nacional de Proteção de Dados (",
      authorityLinkLabel: "cnpd.pt",
      authorityUrl: "https://www.cnpd.pt",
      p2After: ").",
    },
    security: {
      title: "Bezpieczeństwo",
      text: "Połączenie ze stroną jest szyfrowane. Hasła są przechowywane w postaci zaszyfrowanej. Dostęp do kontaktów i kont jest ograniczony i chroniony hasłem. Nie zapisujemy treści Państwa wiadomości w plikach diagnostycznych.",
    },
  },
  termos: {
    metadata: {
      title: "Regulamin korzystania",
      description: "Warunki korzystania ze strony internetowej EvDigital.",
    },
    title: "Regulamin korzystania",
    updatedAt: "24 września 2026",
    intro: "Warunki korzystania z tej strony i ze Strefy Klienta. Są krótkie celowo.",
    about: {
      title: "Czym jest ta strona",
      p1: "Strona informacyjna o usługach EvDigital z formularzem umożliwiającym kontakt z nami oraz ze Strefą Klienta, w której mogą Państwo śledzić projekty i składać zgłoszenia. Nie sprzedajemy tu niczego bezpośrednio ani nie przetwarzamy płatności.",
    },
    content: {
      title: "Treść strony",
      p1: "Staramy się, aby wszystko było poprawne i aktualne, jednak teksty opisują usługi w sposób ogólny i nie stanowią oferty w rozumieniu umowy. Każda praca jest ustalana na podstawie pisemnej, indywidualnej oferty.",
      p2: "Cytowane przez nas dane rynkowe pochodzą z wyraźnie wskazanych źródeł publicznych i odnoszą się do daty ich publikacji.",
    },
    form: {
      title: "Korzystanie z formularza kontaktowego",
      p1Before:
        "Prosimy o podanie prawdziwych danych kontaktowych, abyśmy mogli Państwu odpowiedzieć. Sposób przetwarzania przesłanych nam danych opisano w ",
      privacyLinkLabel: "Polityce prywatności",
      p1After: ".",
      p2: "Nie należy używać formularza do wysyłania niezamówionych reklam ani do jakichkolwiek celów niezgodnych z prawem. Możemy zignorować i usunąć takie wiadomości.",
    },
    conta: {
      title: "Państwa konto",
      p1: "Zakładając konto, prosimy podać prawdziwe dane i przechowywać hasło w bezpiecznym miejscu. Konto jest osobiste: prosimy go nie udostępniać.",
      p2: "Zgłoszenie złożone w Strefie Klienta nie jest zamówieniem: każda praca jest ustalana na podstawie pisemnej, indywidualnej oferty.",
      p3: "Możemy zawiesić lub usunąć konta wykorzystywane do celów niezgodnych z prawem. Mogą Państwo w każdej chwili zażądać usunięcia swojego konta w Ustawieniach.",
    },
    ownership: {
      title: "Własność",
      text: "Teksty, obrazy i kod tej strony należą do EvDigital, chyba że wskazano inne źródło. Mogą nas Państwo cytować z podaniem źródła; nie wolno kopiować strony do własnego użytku komercyjnego.",
    },
    availability: {
      title: "Dostępność",
      text: "Dokładamy starań, aby strona była dostępna, jednak może być tymczasowo niedostępna z powodu konserwacji lub przyczyn technicznych.",
    },
    law: {
      title: "Prawo właściwe",
      p1: "Zastosowanie ma prawo portugalskie. W przypadku sporu konsumenckiego mogą Państwo skorzystać z właściwych podmiotów pozasądowego rozwiązywania sporów.",
    },
  },
};
