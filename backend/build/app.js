"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signup_1 = __importDefault(require("./routes/signup"));
const login_1 = __importDefault(require("./routes/login"));
const profile_1 = __importDefault(require("./routes/profile"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/signup", signup_1.default);
app.use("/login", login_1.default);
app.use("/profile", profile_1.default);
const port = process.env.PORT || 3000;
app.listen(port || 3000, () => {
    console.log(`Listening on port ${port}`);
});
exports.default = app;
