import { Template } from '@pdfme/common';
import { generate } from '@pdfme/generator';
import { text, barcodes, line, rectangle, ellipse, svg, tableBeta } from "@pdfme/schemas";

export async function generatePDF() {
    const template: Template = {
        basePdf: { 
            width: 210, // Largura em milímetros (A4)
            height: 297, // Altura em milímetros (A4)
            padding: [10, 10, 10, 10] // Padding: [top, right, bottom, left]
        },
        schemas: [
            {
                top: {
                    type: 'text',
                    position: { x: 0, y: 0 },
                    width: 210.02,
                    height: 30,
                },
                titulo: {
                    type: 'text',
                    content: 'Título Aqui',
                    fontSize: 47,
                    position: { x: 64, y: 7.7 },
                    width: 81.1,
                    height: 15.2,
                },
                op_produto: {
                    type: 'text',
                    content: 'op: 555555',
                    fontSize: 20,
                    position: { x: 166, y: 17.2 },
                    width: 36,
                    height: 8.5,
                },
                qrcode: {
                    type: 'qrcode',
                    content: 'https://systextil.com.br/',
                    position: { x: 7.1, y: 268.5 },
                    width: 26.60,
                    height: 23
                },
                barcodes: {
                    type: 'code128',
                    content: 'https://systextil.com.br/',
                    position: { x: 148.50, y: 272 },
                    width: 56,
                    height: 19.4
                },
                infos: {
                    type: 'text',
                    content: 'Informações Genéricas...',
                    fontSize: 20,
                    position: { x: 56.7, y: 277.3 },
                    width: 87,
                    height: 9.8,
                },
                line_1: {
                    type: 'line',
                    position: { x: 8.2, y: 30 },
                    width: 194,
                    height: 0.8,
                    color: '#000000'
                },
                line_2: {
                    type: 'line',
                    position: { x: 8.2, y: 266 },
                    width: 194,
                    height: 0.8,
                    color: '#000000'
                },
                
                table: {
                    type: 'table',
                    position: {
                      x: 28.7,
                      y: 37.85
                    },
                    width: 150,
                    height: 57.5,
                    content: "[[\"Alice\",\"New York\",\"Alice is a freelance web designer and developer\"],[\"Bob\",\"Paris\",\"Bob is a freelance illustrator and graphic designer\"]]",
                    showHead: true,
                    head: ["Name", "City", "Description"],
                    headWidthPercentages: [30, 30, 40],
                    tableStyles: {
                      borderWidth: 0.3,
                      borderColor: "#000000"
                    },
                    headStyles: {
                        fontName: "Helvetica",
                        fontSize: 13,
                        characterSpacing: 0,
                        alignment: "left",
                        verticalAlignment: "middle",
                        lineHeight: 1,
                        fontColor: "#ffffff",
                        backgroundColor: "#2980ba",
                        borderWidth: {
                          top: 0,
                          right: 0,
                          bottom: 0,
                          left: 0
                        },
                        padding: {
                          top: 5,
                          right: 5,
                          bottom: 5,
                          left: 5
                        }
                      },
                      bodyStyles: {
                        fontName: "Helvetica",
                        fontSize: 13,
                        characterSpacing: 0,
                        alignment: "left",
                        verticalAlignment: "middle",
                        lineHeight: 1,
                        fontColor: "#000000",
                        borderColor: "#888888",
                        alternateBackgroundColor: "#f5f5f5",
                        borderWidth: {
                          top: 0.1,
                          right: 0.1,
                          bottom: 0.1,
                          left: 0.1
                        },
                        padding: {
                          top: 5,
                          right: 5,
                          bottom: 5,
                          left: 5
                        }
                      },
                      columnStyles: {}
                }
            }
        ]
    };

    const inputs = [
        {
            table: [
                ["Alice", "New York", "Alice is a freelance web designer and developer"],
                ["Bob", "Paris", "Bob is a freelance illustrator and graphic designer"]
            ],
            titulo: 'Teste',
            op_produto: '10',
            qrcode: 'https://systextil.com.br/',
            barcodes: 'https://systextil.com.br/',
            infos: 'Informações Genéricas...',
        }
    ];

    try {
        console.log("Template:", template);
        console.log("Inputs:", inputs);

        const pdf = await generate({
            template,
            inputs,
            plugins: {
                text,
                line,
                rectangle,
                ellipse,
                svg,
                qrcode: barcodes.qrcode,
                barcode: barcodes.code128,
                Table: tableBeta // Certifique-se de que o plugin seja identificado como "Table" com a inicial maiúscula
            }
        });

        // Exibir o PDF no navegador
        const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
        window.open(URL.createObjectURL(blob));

        return pdf;
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
}
