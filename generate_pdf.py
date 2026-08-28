from xhtml2pdf import pisa
import sys

def convert_html_to_pdf(source_html, output_filename):
    # open output file for writing (truncated binary)
    result_file = open(output_filename, "w+b")

    # convert HTML to PDF
    pisa_status = pisa.CreatePDF(
            source_html,                # the HTML to convert
            dest=result_file)           # file handle to recieve result

    # close output file
    result_file.close()

    return pisa_status.err

if __name__ == "__main__":
    html_path = r'd:\ContractSense\ContractSense_Pitch_Guide.html'
    pdf_path = r'd:\ContractSense\ContractSense_Pitch_Guide.pdf'
    
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    err = convert_html_to_pdf(html, pdf_path)
    if err:
        print("Error generating PDF")
        sys.exit(1)
    else:
        print("PDF generated successfully")
