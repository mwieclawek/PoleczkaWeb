import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register TrueType fonts with full Polish character support
FONT_REGULAR = "Arial"
FONT_BOLD = "Arial-Bold"
FONT_ITALIC = "Arial-Italic"

pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", "C:/Windows/Fonts/arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", "C:/Windows/Fonts/ariali.ttf"))

PDF_PATH = os.path.join(os.path.dirname(__file__), "..", "public", "oferta-wigilia-2026.pdf")

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Top banner line (Burgundy)
        self.setFillColor(colors.HexColor("#960C3F"))
        self.rect(0, A4[1] - 8, A4[0], 8, stroke=0, fill=1)
        
        # Gold accent line
        self.setFillColor(colors.HexColor("#D9A261"))
        self.rect(0, A4[1] - 11, A4[0], 3, stroke=0, fill=1)
        
        # Footer
        self.setFont(FONT_REGULAR, 8)
        self.setFillColor(colors.HexColor("#960C3F"))
        footer_text = "Bistro Poleczka · Wrocław, ul. Stefana Jaracza 77B · kontakt@bistropoleczka.pl · tel. 71 880 87 08"
        self.drawCentredString(A4[0] / 2.0, 18, footer_text)
        
        page_str = f"Strona {self._pageNumber} z {page_count}"
        self.drawRightString(A4[0] - 36, 18, page_str)
        self.restoreState()

def build_pdf():
    doc = SimpleDocTemplate(
        PDF_PATH,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    primary_color = colors.HexColor("#960C3F")
    secondary_color = colors.HexColor("#CA5254")
    gold_color = colors.HexColor("#D9A261")
    dark_text = colors.HexColor("#2D151E")
    muted_text = colors.HexColor("#6B5B61")

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=22,
        leading=26,
        textColor=primary_color,
        alignment=1,
        spaceAfter=2
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=15,
        leading=18,
        textColor=secondary_color,
        alignment=1,
        spaceAfter=10
    )

    pkg_header_style = ParagraphStyle(
        'PkgHeader',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=14,
        leading=17,
        textColor=primary_color,
        spaceAfter=2
    )

    pkg_meta_style = ParagraphStyle(
        'PkgMeta',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=10.5,
        leading=14,
        textColor=gold_color,
        spaceAfter=8
    )

    category_title = ParagraphStyle(
        'CatTitle',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=10,
        leading=13,
        textColor=primary_color,
        spaceBefore=5,
        spaceAfter=1
    )

    category_rule = ParagraphStyle(
        'CatRule',
        parent=styles['Normal'],
        fontName=FONT_ITALIC,
        fontSize=8.5,
        leading=11,
        textColor=muted_text,
        spaceAfter=2
    )

    item_style = ParagraphStyle(
        'ItemStyle',
        parent=styles['Normal'],
        fontName=FONT_REGULAR,
        fontSize=8.5,
        leading=11,
        textColor=dark_text,
        leftIndent=10,
        firstLineIndent=-10
    )

    contact_info_style = ParagraphStyle(
        'ContactInfo',
        parent=styles['Normal'],
        fontName=FONT_BOLD,
        fontSize=9,
        leading=12,
        textColor=primary_color,
        alignment=1,
        spaceBefore=10
    )

    story = []

    # Header
    story.append(Paragraph("Bistro Poleczka", title_style))
    story.append(Paragraph("Oferta Wigilia 2026", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=gold_color, spaceBefore=0, spaceAfter=8))

    # --- PAKIET 1: SPOTKANIE WIGILIJNE ---
    story.append(Paragraph("Spotkanie Wigilijne", pkg_header_style))
    story.append(Paragraph("Cena: <b>160 zł na osobę</b> &nbsp;|&nbsp; Czas trwania: <b>2,5–3,5h</b>", pkg_meta_style))

    # Przystawka
    story.append(Paragraph("Przystawka", category_title))
    story.append(Paragraph("Wybierz 1 szt. – serwowana jednoporcjowo:", category_rule))
    story.append(Paragraph("1) Tatar ze śledzia z musztardą francuską, jabłkiem i rzodkiewką", item_style))
    story.append(Paragraph("2) Wytrawna tarta z szalotką, kozim serem, tymiankiem i miodem", item_style))

    # Zupa
    story.append(Paragraph("Zupa", category_title))
    story.append(Paragraph("Wybierz 1 szt. – serwowana jednoporcjowo:", category_rule))
    story.append(Paragraph("1) Barszcz czerwony czysty z uszkami", item_style))
    story.append(Paragraph("2) Barszcz czerwony czysty z pasztecikiem drożdżowym z kapustą i grzybami", item_style))

    # Drugie danie
    story.append(Paragraph("Drugie danie", category_title))
    story.append(Paragraph("Wybierz 1 szt. – serwowane jednoporcjowo:", category_rule))
    dania1 = [
        "1) Pierogi ruskie",
        "2) Pierogi z kapustą i grzybami",
        "3) Pierogi z kaszą gryczaną i wędzonym twarogiem",
        "4) Dorsz w sosie porowym z puree ziemniaczanym",
        "5) Krokiety z kapustą i grzybami",
        "6) Krokiety z mięsem i kapustą",
        "7) Gołąbki z mięsem z sosem pomidorowym lub grzybowym",
        "8) Gołąbki vege z sosem pomidorowym lub grzybowym",
        "9) Ryba po grecku z pieczonymi ziemniakami",
        "10) Polędwiczka wieprzowa w sosie chrzanowym z kluskami śląskimi",
        "11) Polędwiczka wieprzowa w sosie z zielonego pieprzu z kluskami śląskimi",
        "12) Bigos w chlebie"
    ]
    for d in dania1:
        story.append(Paragraph(d, item_style))

    # Dodatki warzywne
    story.append(Paragraph("Dodatki warzywne", category_title))
    story.append(Paragraph("Wybierz 3 szt. – dodatki serwowane są wieloporcjowo:", category_rule))
    dodatki1 = [
        "1) Kapusta z grochem",
        "2) Biała fasola z masłem i rozmarynem",
        "3) Buraczki z cebulką na zimno",
        "4) Buraczki z chrzanem na ciepło",
        "5) Surówka z kiszonej kapusty",
        "6) Surówka z marchewki i jabłka",
        "7) Mix gotowanych warzyw z masłem",
        "8) Sałatka ziemniaczana",
        "9) Sałatka ze świeżych warzyw z winagretem",
        "10) Carpaccio z buraka z sosem balsamicznym i rukolą",
        "11) Śledzie w śmietanie",
        "12) Śledzie w porach z orzechami włoskimi",
        "13) Śledzie z czerwoną cebulą i suszonymi pomidorami"
    ]
    for w in dodatki1:
        story.append(Paragraph(w, item_style))

    # Desery
    story.append(Paragraph("Desery", category_title))
    story.append(Paragraph("Wybierz 1 szt. – serwowane jednoporcjowo:", category_rule))
    for des in ["1) Makowiec", "2) Piernik", "3) Ciasto marchewkowe", "4) Sernik"]:
        story.append(Paragraph(des, item_style))

    # Napoje
    story.append(Paragraph("Napoje", category_title))
    story.append(Paragraph("Wybierz 2 szt.:", category_rule))
    for nap in ["1) Kompot", "2) Kompot z suszu", "3) Woda z cytryną", "4) Kawa / herbata"]:
        story.append(Paragraph(nap, item_style))

    # --- PAKIET 2: SPOTKANIE WIGILIJNE BIESIADNE ---
    story.append(PageBreak())

    story.append(Paragraph("Spotkanie wigilijne biesiadne", pkg_header_style))
    story.append(Paragraph("Cena: <b>200 zł na osobę</b> &nbsp;|&nbsp; Czas trwania: <b>4–5h</b>", pkg_meta_style))
    story.append(HRFlowable(width="100%", thickness=1, color=gold_color, spaceBefore=0, spaceAfter=6))

    # Zupa
    story.append(Paragraph("Zupa", category_title))
    story.append(Paragraph("Wybierz 1 szt. – zupa serwowana jest wieloporcjowo w wazie:", category_rule))
    zupy2 = [
        "1) Barszcz czerwony czysty",
        "2) Barszcz czerwony czysty z pasztecikiem drożdżowym z kapustą i grzybami",
        "3) Barszcz z burakami i tłuczonymi ziemniakami",
        "4) Grzybowa"
    ]
    for z in zupy2:
        story.append(Paragraph(z, item_style))

    # Drugie danie
    story.append(Paragraph("Drugie danie", category_title))
    story.append(Paragraph("Wybierz 3 szt. – serwowane wieloporcjowo na paterach:", category_rule))
    dania2 = [
        "1) Pierogi ruskie",
        "2) Pierogi z kapustą i grzybami",
        "3) Pierogi z kaszą gryczaną i wędzonym twarogiem",
        "4) Karp smażony",
        "5) Krokiety z kapustą i grzybami",
        "6) Krokiety z mięsem i kapustą",
        "7) Gołąbki z mięsem z sosem pomidorowym lub grzybowym",
        "8) Gołąbki vege z sosem pomidorowym lub grzybowym",
        "9) Ryba po grecku",
        "10) Polędwiczka wieprzowa w sosie chrzanowym",
        "11) Polędwiczka wieprzowa w sosie z zielonego pieprzu",
        "12) Bigos"
    ]
    for d in dania2:
        story.append(Paragraph(d, item_style))

    # Dodatki skrobiowe
    story.append(Paragraph("Dodatki skrobiowe", category_title))
    story.append(Paragraph("Wybierz 1–2 szt. – dodatki skrobiowe serwowane wieloporcjowo na półmiskach:", category_rule))
    for s in ["1) Ziemniaki z masłem i koperkiem", "2) Puree ziemniaczane", "3) Kluski śląskie z masłem i szczypiorkiem", "4) Frytki"]:
        story.append(Paragraph(s, item_style))

    # Dodatki warzywne
    story.append(Paragraph("Dodatki warzywne", category_title))
    story.append(Paragraph("Wybierz 3 szt. – dodatki warzywne serwowane wieloporcjowo na półmiskach:", category_rule))
    for w in dodatki1:
        story.append(Paragraph(w, item_style))

    # Zakąski
    story.append(Paragraph("Zakąski", category_title))
    story.append(Paragraph("Wybierz 5 szt. – po 1 sztuce z każdej wybranej pozycji na osobę:", category_rule))
    zakaski = [
        "1) Paszteciki drożdżowe z kapustą i grzybami",
        "2) Paszteciki drożdżowe z pieczarkami i serem",
        "3) Paszteciki z ciasta francuskiego ze szpinakiem i fetą",
        "4) Daktyle w bekonie",
        "5) Tartaletki z serkiem śmietankowym i grzybami na maśle",
        "6) Tartaletki z gruszką i serem z niebieską pleśnią",
        "7) Koreczki z camembertem i figą",
        "8) Kulki twarogowe z burakiem i orzechem włoskim",
        "9) Kanapeczki z serkiem śmietankowym i łososiem",
        "10) Kanapeczki ze śledziem, burakiem i cebulą czerwoną",
        "11) Jaja faszerowane",
        "12) Sakiewki z ciasta filo z camembertem i pesto pietruszkowym",
        "13) Sakiewki z ciasta filo z karmelizowaną cebulą i serem z niebieską pleśnią",
        "14) Kutia w tartaletce z ciasta filo"
    ]
    for zak in zakaski:
        story.append(Paragraph(zak, item_style))

    # Desery
    story.append(Paragraph("Desery", category_title))
    story.append(Paragraph("Wybierz 2 szt. – po 2 kawałki na osobę. Serwowane na paterach:", category_rule))
    for des in ["1) Makowiec", "2) Piernik", "3) Ciasto marchewkowe", "4) Sernik"]:
        story.append(Paragraph(des, item_style))

    # Napoje
    story.append(Paragraph("Napoje", category_title))
    story.append(Paragraph("Wybierz 2 szt.:", category_rule))
    for nap in ["1) Kompot", "2) Kompot z suszu", "3) Woda z cytryną", "4) Kawa / herbata"]:
        story.append(Paragraph(nap, item_style))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=0.8, color=gold_color, spaceBefore=4, spaceAfter=6))
    story.append(Paragraph("W celu zapytania o ofertę lub rezerwacji prosimy o kontakt mailowy: <b>kontakt@bistropoleczka.pl</b> lub telefoniczny: <b>71 880 87 08</b>", contact_info_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF with Polish font generated successfully:", PDF_PATH)

if __name__ == "__main__":
    build_pdf()
