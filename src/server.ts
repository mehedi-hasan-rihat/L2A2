import config from './config';
import app from './app';
import { BookingService } from './modules/booking/booking.service';

const port = config.port;

setInterval(() => {
    BookingService.autoReturnExpiredBookings();
}, 24 * 60 * 60 * 1000);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});