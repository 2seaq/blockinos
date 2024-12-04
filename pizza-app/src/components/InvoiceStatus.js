import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { io } from 'socket.io-client';
import config from '../config.json';
import crypto from 'crypto-browserify';
import {
    Box,
    Backdrop,
    Typography,
    Paper,
    TextField,
    Button
} from '@mui/material';

const rune = config.rune;
const clnsocket = config.clnsocket;

const InvoiceStatus = ({ invoice, order }) => {
    const [status, setStatus] = useState('Pending');
    const [preimage, setPreimage] = useState(null);

    const bolt11 = invoice.bolt11;
    const label = order.label;
    const msat = order.amount_msat;
    const orderpaymenthash = invoice.payment_hash;

    useEffect(() => {
        const socket = io.connect(clnsocket, {
            extraHeaders: {
                rune: rune,
            },
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        socket.on('message', (data) => {
            console.log('WebSocket message:', data);

            try {
                const message = typeof data === 'string' ? JSON.parse(data) : data;

                if (message.invoice_payment) {
                    const { preimage: paymentPreimage } = message.invoice_payment;
                    const computedHash = crypto.createHash('sha256').update(Buffer.from(paymentPreimage, 'hex')).digest('hex');

                    if (computedHash === orderpaymenthash) {
                        setStatus('Paid');
                        setPreimage(paymentPreimage);
                        console.log('Invoice paid:', message.invoice_payment);
                    } else {
                        console.log('Invoice payment received but details do not match.');
                    }
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });

        socket.on('error', (err) => {
            console.error('WebSocket error:', err);
        });

        return () => {
            socket.disconnect();
        };
    }, [label, msat, orderpaymenthash]);

    return (
        <Box>
            <Typography variant="h5" component="h3" gutterBottom>
                Invoice Status
            </Typography>
            <Typography variant="body1" gutterBottom>
                Status: <strong>{status}</strong>
            </Typography>

            {status === 'Pending' && bolt11 && (
                <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Paper sx={{ padding: 4, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Scan the QR code below to pay:
                        </Typography>
                        <QRCodeCanvas value={bolt11} size={256} />

                        {/* Display bolt11 in a copyable TextField */}
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                Invoice (bolt11):
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TextField
                                    value={bolt11}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    sx={{ backgroundColor: '#f0f0f0', borderRadius: 1 }}
                                />
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                        try {
                                            // Use clipboard API if available
                                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                                navigator.clipboard.writeText(bolt11);
                                                alert('Copied to clipboard!');
                                            } else {
                                                // Fallback for unsupported browsers
                                                const tempInput = document.createElement('input');
                                                tempInput.value = bolt11;
                                                document.body.appendChild(tempInput);
                                                tempInput.select();
                                                document.execCommand('copy');
                                                document.body.removeChild(tempInput);
                                                alert('Copied to clipboard!');
                                            }
                                        } catch (err) {
                                            console.error('Copy failed', err);
                                            alert('Failed to copy');
                                        }
                                    }}
                                >
                                    Copy
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Backdrop>


            )}

            {status === 'Paid' && preimage && (
                <Box mt={2}>
                    <Typography variant="h6" color="success.main">
                        Invoice has been paid!
                    </Typography>
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                        Preimage: <code>{preimage}</code>
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default InvoiceStatus;
