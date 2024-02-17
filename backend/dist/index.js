"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./routes/auth"));
const mongoose_1 = __importStar(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const feed_1 = __importDefault(require("./routes/feed"));
const errorHandler = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(err);
    if (err instanceof mongoose_1.MongooseError) {
        return res.status(504).json({
            message: "Connection with database could not be made"
        });
    }
    else {
        return res.status(504).json({
            message: "Some server side error occurred"
        });
    }
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_1.default);
app.use('/feed', feed_1.default);
app.use(errorHandler);
mongoose_1.default.connect('mongodb+srv://ashutoshsangra:4xj7hdS43aAv70PZ@cluster0.4ucnbnd.mongodb.net/', { dbName: 'insta-clone' })
    .then((value) => {
    console.log('Connection to mongodb created');
    app.listen(3000, () => {
        console.log(`Application is listening on port 3000`);
    });
})
    .catch((err) => console.error(`Conn to mongodb failed/ ${err}`));
