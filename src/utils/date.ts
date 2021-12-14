import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat'; // import plugin

dayjs.extend(customParseFormat); // use plugin

export default dayjs;
