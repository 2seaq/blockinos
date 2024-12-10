import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { io } from 'socket.io-client';
import crypto from 'crypto-browserify';
import {
    Box,
    Backdrop,
    Typography,
    Paper,
    TextField,
    Button
} from '@mui/material';

const InvoiceStatus = ({ invoice, order, onClose }) => {
    const [status, setStatus] = useState('Pending');
    const [preimage, setPreimage] = useState(null);

    const bolt11 = invoice.bolt11;
    const label = order.label;
    const msat = order.amount_msat;
    const orderpaymenthash = invoice.payment_hash;

    useEffect(() => {
        const socket = io('https://blockinos.osys.com', {
            path: '/socket.io/',
            transports: ['websocket'],
        });

        socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected:', reason);
        });

        socket.on('message', (data) => {
            try {
                const message = typeof data === 'string' ? JSON.parse(data) : data;

                if (message.invoice_payment) {
                    const { preimage: paymentPreimage } = message.invoice_payment;
                    const computedHash = crypto.createHash('sha256').update(Buffer.from(paymentPreimage, 'hex')).digest('hex');

                    if (computedHash === orderpaymenthash) {
                        setStatus('Paid');
                        setPreimage(paymentPreimage);
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

    const handleClose = () => {
        setStatus('Empty');
        setPreimage(null);
        if (onClose) {
            onClose();
        }
    };

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
                                        navigator.clipboard.writeText(bolt11).then(() => {
                                            alert('Copied to clipboard!');
                                        }).catch(() => {
                                            alert('Failed to copy');
                                        });
                                    }}
                                >
                                    Copy
                                </Button>
                            </Box>
                        </Box>

                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleClose}
                            sx={{ marginTop: 2 }}
                        >
                            Close
                        </Button>
                    </Paper>
                </Backdrop>
            )}

            {status === 'Paid' && preimage && (
                <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Paper sx={{ padding: 4, textAlign: 'center', backgroundColor: 'green', color: 'white' }}>
                        <Typography variant="h6">
                            Invoice has been paid!
                        </Typography>
                        <Typography variant="body2" sx={{ marginTop: 2 }}>
                            Preimage: <code>{preimage}</code>
                        </Typography>

                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleClose}
                            sx={{ marginTop: 2 }}
                        >
                            Close
                        </Button>
                    </Paper>
                </Backdrop>
            )}
        </Box>
    );
};

export default InvoiceStatus;
