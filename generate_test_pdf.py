from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'MASTER SERVICES AGREEMENT', 0, 1, 'C')
        self.ln(5)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def create_pdf():
    pdf = PDF()
    pdf.add_page()
    
    pdf.set_font('Arial', '', 11)
    
    # Intro
    intro = """This Master Services Agreement ("Agreement") is entered into as of October 1, 2026 (the "Effective Date"), by and between:

Globex OmniCorp Ltd., a company registered in the United Kingdom, having its principal place of business at 100 Corporate Way, London, UK (hereinafter referred to as the "Buyer"),

AND

TechSolutions India Pvt. Ltd., an MSME registered under the MSME Development Act, 2006, having its registered office at 45 Startup Hub, Koramangala, Bengaluru, Karnataka 560034, India (hereinafter referred to as the "Vendor")."""
    pdf.multi_cell(0, 6, intro)
    pdf.ln(5)
    
    # 1. Services
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 8, '1. Scope of Services', 0, 1)
    pdf.set_font('Arial', '', 11)
    pdf.multi_cell(0, 6, 'The Vendor agrees to provide software development and IT maintenance services as described in the attached Statements of Work (SOWs) from time to time.')
    pdf.ln(5)
    
    # 2. Payment Terms (RISK: 90 days instead of 45)
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 8, '2. Consideration and Payment Terms', 0, 1)
    pdf.set_font('Arial', '', 11)
    pdf.multi_cell(0, 6, 'For the services rendered, the Buyer shall pay the Vendor a flat fee of $50,000 USD per quarter. The Vendor shall submit invoices at the end of each quarter. The Buyer shall make payment within ninety (90) days of receipt of a valid and undisputed invoice. If the Buyer disputes any portion of the invoice, the Buyer may withhold the entire payment until the dispute is resolved.')
    pdf.ln(5)
    
    # 3. Liability (RISK: Asymmetric / Uncapped for MSME)
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 8, '3. Limitation of Liability', 0, 1)
    pdf.set_font('Arial', '', 11)
    pdf.multi_cell(0, 6, 'In no event shall the Buyer\'s total aggregate liability arising out of or related to this Agreement exceed the total amounts actually paid to the Vendor in the three (3) months preceding the event giving rise to the claim. However, the Vendor\'s liability for any breach, negligence, or indemnity obligations under this Agreement shall be strictly uncapped and absolute.')
    pdf.ln(5)
    
    # 4. Termination (RISK: Unilateral 0-day termination)
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 8, '4. Term and Termination', 0, 1)
    pdf.set_font('Arial', '', 11)
    pdf.multi_cell(0, 6, 'This Agreement shall commence on the Effective Date and continue for a period of two (2) years. The Buyer reserves the right to terminate this Agreement immediately without cause and without prior notice at its sole discretion. In the event of such termination, no further payments will be due for services not yet completed.')
    pdf.ln(5)

    # 5. Dispute Resolution (RISK: Foreign Jurisdiction & Arbitration)
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 8, '5. Governing Law and Dispute Resolution', 0, 1)
    pdf.set_font('Arial', '', 11)
    pdf.multi_cell(0, 6, 'This Agreement shall be governed by and construed in accordance with the laws of England and Wales. All disputes, controversies, or claims arising out of or in connection with this Agreement shall be exclusively settled by binding arbitration in London, United Kingdom. Both parties explicitly waive any rights to approach any local MSME Facilitation Council or local courts in India.')
    pdf.ln(5)
    
    # Signatures
    pdf.ln(10)
    pdf.cell(90, 8, 'For: Globex OmniCorp Ltd.', 0, 0)
    pdf.cell(90, 8, 'For: TechSolutions India Pvt. Ltd.', 0, 1)
    pdf.ln(15)
    pdf.cell(90, 8, '________________________', 0, 0)
    pdf.cell(90, 8, '________________________', 0, 1)
    pdf.cell(90, 8, 'Name: John Smith', 0, 0)
    pdf.cell(90, 8, 'Name: Rajesh Kumar', 0, 1)
    pdf.cell(90, 8, 'Title: VP of Procurement', 0, 0)
    pdf.cell(90, 8, 'Title: CEO', 0, 1)

    pdf.output("d:/ContractSense/test_contract_risky.pdf")

if __name__ == "__main__":
    create_pdf()
