 (function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jmespath = {}));
 })(this, (function (exports) { 'use strict';

   var Token;
   (function (Token) {
	   Token["TOK_EOF"] = "EOF";
	   Token["TOK_UNQUOTEDIDENTIFIER"] = "UnquotedIdentifier";
	   Token["TOK_QUOTEDIDENTIFIER"] = "QuotedIdentifier";
	   Token["TOK_RBRACKET"] = "Rbracket";
	   Token["TOK_RPAREN"] = "Rparen";
	   Token["TOK_COMMA"] = "Comma";
	   Token["TOK_COLON"] = "Colon";
	   Token["TOK_RBRACE"] = "Rbrace";
	   Token["TOK_NUMBER"] = "Number";
	   Token["TOK_CURRENT"] = "Current";
	   Token["TOK_ROOT"] = "Root";
	   Token["TOK_EXPREF"] = "Expref";
	   Token["TOK_PIPE"] = "Pipe";
	   Token["TOK_OR"] = "Or";
	   Token["TOK_AND"] = "And";
	   Token["TOK_EQ"] = "EQ";
	   Token["TOK_GT"] = "GT";
	   Token["TOK_LT"] = "LT";
	   Token["TOK_GTE"] = "GTE";
	   Token["TOK_LTE"] = "LTE";
	   Token["TOK_NE"] = "NE";
	   Token["TOK_PLUS"] = "Plus";
	   Token["TOK_MINUS"] = "Minus";
	   Token["TOK_MULTIPLY"] = "Multiply";
	   Token["TOK_DIVIDE"] = "Divide";
	   Token["TOK_MODULO"] = "Modulo";
	   Token["TOK_DIV"] = "Div";
	   Token["TOK_FLATTEN"] = "Flatten";
	   Token["TOK_STAR"] = "Star";
	   Token["TOK_FILTER"] = "Filter";
	   Token["TOK_DOT"] = "Dot";
	   Token["TOK_NOT"] = "Not";
	   Token["TOK_LBRACE"] = "Lbrace";
	   Token["TOK_LBRACKET"] = "Lbracket";
	   Token["TOK_LPAREN"] = "Lparen";
	   Token["TOK_LITERAL"] = "Literal";
   })(Token || (Token = {}));

   const isObject = (obj) => {
	   return obj !== null && Object.prototype.toString.call(obj) === '[object Object]';
   };
   const strictDeepEqual = (first, second) => {
	   if (first === second) {
		   return true;
	   }
	   if (typeof first !== typeof second) {
		   return false;
	   }
	   if (Array.isArray(first) && Array.isArray(second)) {
		   if (first.length !== second.length) {
			   return false;
		   }
		   for (let i = 0; i < first.length; i += 1) {
			   if (!strictDeepEqual(first[i], second[i])) {
				   return false;
			   }
		   }
		   return true;
	   }
	   if (isObject(first) && isObject(second)) {
		   const firstEntries = Object.entries(first);
		   const secondKeys = new Set(Object.keys(second));
		   if (firstEntries.length !== secondKeys.size) {
			   return false;
		   }
		   for (const [key, value] of firstEntries) {
			   if (!strictDeepEqual(value, second[key])) {
				   return false;
			   }
			   secondKeys.delete(key);
		   }
		   return secondKeys.size === 0;
	   }
	   return false;
   };
   const isFalse = (obj) => {
	   if (typeof obj === 'object') {
		   if (obj === null) {
			   return true;
		   }
		   if (Array.isArray(obj)) {
			   return obj.length === 0;
		   }
		   // eslint-disable-next-line @typescript-eslint/naming-convention
		   for (const _key in obj) {
			   return false;
		   }
		   return true;
	   }
	   return !(typeof obj === 'number' || obj);
   };
   const isAlpha = (ch) => {
	   // tslint:disable-next-line: strict-comparisons
	   return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_';
   };
   const isNum = (ch) => {
	   // tslint:disable-next-line: strict-comparisons
	   return (ch >= '0' && ch <= '9') || ch === '-';
   };
   const isAlphaNum = (ch) => {
	   // tslint:disable-next-line: strict-comparisons
	   return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9') || ch === '_';
   };
   const ensureInteger = (value) => {
	   if (!(typeof value === 'number') || Math.floor(value) !== value) {
		   throw new Error('invalid-value: expecting an integer.');
	   }
	   return value;
   };
   const ensurePositiveInteger = (value) => {
	   if (!(typeof value === 'number') || value < 0 || Math.floor(value) !== value) {
		   throw new Error('invalid-value: expecting a non-negative integer.');
	   }
	   return value;
   };
   const ensureNumbers = (...operands) => {
	   for (let i = 0; i < operands.length; i++) {
		   if (operands[i] === null || operands[i] === undefined) {
			   throw new Error('not-a-number: undefined');
		   }
		   if (typeof operands[i] !== 'number') {
			   throw new Error('not-a-number');
		   }
	   }
   };
   const notZero = (n) => {
	   n = +n; // coerce to number
	   if (!n) {
		   // matches -0, +0, NaN
		   throw new Error('not-a-number: divide by zero');
	   }
	   return n;
   };
   const add = (left, right) => {
	   ensureNumbers(left, right);
	   const result = left + right;
	   return result;
   };
   const sub = (left, right) => {
	   ensureNumbers(left, right);
	   const result = left - right;
	   return result;
   };
   const mul = (left, right) => {
	   ensureNumbers(left, right);
	   const result = left * right;
	   return result;
   };
   const divide = (left, right) => {
	   ensureNumbers(left, right);
	   const result = left / notZero(right);
	   return result;
   };
   const div = (left, right) => {
	   ensureNumbers(left, right);
	   const result = Math.floor(left / notZero(right));
	   return result;
   };
   const mod = (left, right) => {
	   ensureNumbers(left, right);
	   const result = left % right;
	   return result;
   };

   const basicTokens = {
	   '(': Token.TOK_LPAREN,
	   ')': Token.TOK_RPAREN,
	   '*': Token.TOK_STAR,
	   ',': Token.TOK_COMMA,
	   '.': Token.TOK_DOT,
	   ':': Token.TOK_COLON,
	   '@': Token.TOK_CURRENT,
	   ['$']: Token.TOK_ROOT,
	   ']': Token.TOK_RBRACKET,
	   '{': Token.TOK_LBRACE,
	   '}': Token.TOK_RBRACE,
	   '+': Token.TOK_PLUS,
	   '%': Token.TOK_MODULO,
	   '\u2212': Token.TOK_MINUS,
	   '\u00d7': Token.TOK_MULTIPLY,
	   '\u00f7': Token.TOK_DIVIDE,
   };
   const operatorStartToken = {
	   '!': true,
	   '<': true,
	   '=': true,
	   '>': true,
	   '&': true,
	   '|': true,
	   '/': true,
   };
   const skipChars = {
	   '\t': true,
	   '\n': true,
	   '\r': true,
	   ' ': true,
   };
   class StreamLexer {
	   constructor() {
		   this._current = 0;
		   this._enable_legacy_literals = false;
	   }
	   tokenize(stream, options) {
		   const tokens = [];
		   this._current = 0;
		   this._enable_legacy_literals = (options === null || options === void 0 ? void 0 : options.enable_legacy_literals) || false;
		   let start;
		   let identifier;
		   let token;
		   while (this._current < stream.length) {
			   if (isAlpha(stream[this._current])) {
				   start = this._current;
				   identifier = this.consumeUnquotedIdentifier(stream);
				   tokens.push({
					   start,
					   type: Token.TOK_UNQUOTEDIDENTIFIER,
					   value: identifier,
				   });
			   }
			   else if (basicTokens[stream[this._current]] !== undefined) {
				   tokens.push({
					   start: this._current,
					   type: basicTokens[stream[this._current]],
					   value: stream[this._current],
				   });
				   this._current += 1;
			   }
			   else if (stream[this._current] === '-') {
				   if (this._current + 1 < stream.length && isNum(stream[this._current + 1])) {
					   const token = this.consumeNumber(stream);
					   token && tokens.push(token);
				   }
				   else {
					   const token = {
						   start: this._current,
						   type: Token.TOK_MINUS,
						   value: '-',
					   };
					   tokens.push(token);
					   this._current += 1;
				   }
			   }
			   else if (isNum(stream[this._current])) {
				   token = this.consumeNumber(stream);
				   tokens.push(token);
			   }
			   else if (stream[this._current] === '[') {
				   token = this.consumeLBracket(stream);
				   tokens.push(token);
			   }
			   else if (stream[this._current] === '"') {
				   start = this._current;
				   identifier = this.consumeQuotedIdentifier(stream);
				   tokens.push({
					   start,
					   type: Token.TOK_QUOTEDIDENTIFIER,
					   value: identifier,
				   });
			   }
			   else if (stream[this._current] === `'`) {
				   start = this._current;
				   identifier = this.consumeRawStringLiteral(stream);
				   tokens.push({
					   start,
					   type: Token.TOK_LITERAL,
					   value: identifier,
				   });
			   }
			   else if (stream[this._current] === '`') {
				   start = this._current;
				   const literal = this.consumeLiteral(stream);
				   tokens.push({
					   start,
					   type: Token.TOK_LITERAL,
					   value: literal,
				   });
			   }
			   else if (operatorStartToken[stream[this._current]] !== undefined) {
				   token = this.consumeOperator(stream);
				   token && tokens.push(token);
			   }
			   else if (skipChars[stream[this._current]] !== undefined) {
				   this._current += 1;
			   }
			   else {
				   const error = new Error(`Syntax error: unknown character: ${stream[this._current]}`);
				   error.name = 'LexerError';
				   throw error;
			   }
		   }
		   return tokens;
	   }
	   consumeUnquotedIdentifier(stream) {
		   const start = this._current;
		   this._current += 1;
		   while (this._current < stream.length && isAlphaNum(stream[this._current])) {
			   this._current += 1;
		   }
		   return stream.slice(start, this._current);
	   }
	   consumeQuotedIdentifier(stream) {
		   const start = this._current;
		   this._current += 1;
		   const maxLength = stream.length;
		   while (stream[this._current] !== '"' && this._current < maxLength) {
			   let current = this._current;
			   if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === '"')) {
				   current += 2;
			   }
			   else {
				   current += 1;
			   }
			   this._current = current;
		   }
		   this._current += 1;
		   const [value, ok] = this.parseJSON(stream.slice(start, this._current));
		   if (!ok) {
			   const error = new Error(`syntax: unexpected end of JSON input`);
			   error.name = 'LexerError';
			   throw error;
		   }
		   return value;
	   }
	   consumeRawStringLiteral(stream) {
		   const start = this._current;
		   this._current += 1;
		   const maxLength = stream.length;
		   while (stream[this._current] !== `'` && this._current < maxLength) {
			   let current = this._current;
			   if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === `'`)) {
				   current += 2;
			   }
			   else {
				   current += 1;
			   }
			   this._current = current;
		   }
		   this._current += 1;
		   const literal = stream.slice(start + 1, this._current - 1);
		   return literal.replace(`\\'`, `'`).replace(`\\\\`, `\\`);
	   }
	   consumeNumber(stream) {
		   const start = this._current;
		   this._current += 1;
		   const maxLength = stream.length;
		   while (isNum(stream[this._current]) && this._current < maxLength) {
			   this._current += 1;
		   }
		   const value = parseInt(stream.slice(start, this._current), 10);
		   return { start, value, type: Token.TOK_NUMBER };
	   }
	   consumeLBracket(stream) {
		   const start = this._current;
		   this._current += 1;
		   if (stream[this._current] === '?') {
			   this._current += 1;
			   return { start, type: Token.TOK_FILTER, value: '[?' };
		   }
		   if (stream[this._current] === ']') {
			   this._current += 1;
			   return { start, type: Token.TOK_FLATTEN, value: '[]' };
		   }
		   return { start, type: Token.TOK_LBRACKET, value: '[' };
	   }
	   consumeOrElse(stream, peek, token, orElse) {
		   const start = this._current;
		   this._current += 1;
		   if (this._current < stream.length && stream[this._current] === peek) {
			   this._current += 1;
			   return { start: start, type: orElse, value: stream.slice(start, this._current) };
		   }
		   if (token === Token.TOK_EOF) {
			   const error = new Error(`syntax: unknown incomplete token: ${stream[start]}`);
			   error.name = 'LexerError';
			   throw error;
		   }
		   return { start: start, type: token, value: stream[start] };
	   }
	   consumeOperator(stream) {
		   const start = this._current;
		   const startingChar = stream[start];
		   switch (startingChar) {
			   case '!':
				   return this.consumeOrElse(stream, '=', Token.TOK_NOT, Token.TOK_NE);
			   case '<':
				   return this.consumeOrElse(stream, '=', Token.TOK_LT, Token.TOK_LTE);
			   case '>':
				   return this.consumeOrElse(stream, '=', Token.TOK_GT, Token.TOK_GTE);
			   case '=':
				   return this.consumeOrElse(stream, '=', Token.TOK_EOF, Token.TOK_EQ);
			   case '&':
				   return this.consumeOrElse(stream, '&', Token.TOK_EXPREF, Token.TOK_AND);
			   case '|':
				   return this.consumeOrElse(stream, '|', Token.TOK_PIPE, Token.TOK_OR);
			   case '/':
				   return this.consumeOrElse(stream, '/', Token.TOK_DIVIDE, Token.TOK_DIV);
		   }
	   }
	   consumeLiteral(stream) {
		   this._current += 1;
		   const start = this._current;
		   const maxLength = stream.length;
		   while (stream[this._current] !== '`' && this._current < maxLength) {
			   let current = this._current;
			   if (stream[current] === '\\' && (stream[current + 1] === '\\' || stream[current + 1] === '`')) {
				   current += 2;
			   }
			   else {
				   current += 1;
			   }
			   this._current = current;
		   }
		   let literalString = stream.slice(start, this._current).trimStart();
		   literalString = literalString.replace('\\`', '`');
		   let literal = null;
		   let ok = false;
		   // attempts to detect and parse valid JSON
		   if (this.looksLikeJSON(literalString)) {
			   [literal, ok] = this.parseJSON(literalString);
		   }
		   // invalid JSON values should be converted to quoted
		   // JSON strings during the JEP-12 deprecation period.
		   if (!ok && this._enable_legacy_literals) {
			   [literal, ok] = this.parseJSON(`"${literalString}"`);
		   }
		   if (!ok) {
			   const error = new Error(`Syntax error: unexpected end of JSON input or invalid format for a JSON literal: ${stream[this._current]}`);
			   error.name = 'LexerError';
			   throw error;
		   }
		   this._current += 1;
		   return literal;
	   }
	   looksLikeJSON(literalString) {
		   const startingChars = '[{"';
		   const jsonLiterals = ['true', 'false', 'null'];
		   const numberLooking = '-0123456789';
		   if (literalString === '') {
			   return false;
		   }
		   if (startingChars.includes(literalString[0])) {
			   return true;
		   }
		   if (jsonLiterals.includes(literalString)) {
			   return true;
		   }
		   if (numberLooking.includes(literalString[0])) {
			   const [_, ok] = this.parseJSON(literalString);
			   return ok;
		   }
		   return false;
	   }
	   parseJSON(text) {
		   try {
			   const json = JSON.parse(text);
			   return [json, true];
		   }
		   catch (_a) {
			   return [null, false];
		   }
	   }
   }
   const Lexer = new StreamLexer();

   const bindingPower = {
	   [Token.TOK_EOF]: 0,
	   [Token.TOK_UNQUOTEDIDENTIFIER]: 0,
	   [Token.TOK_QUOTEDIDENTIFIER]: 0,
	   [Token.TOK_RBRACKET]: 0,
	   [Token.TOK_RPAREN]: 0,
	   [Token.TOK_COMMA]: 0,
	   [Token.TOK_RBRACE]: 0,
	   [Token.TOK_NUMBER]: 0,
	   [Token.TOK_CURRENT]: 0,
	   [Token.TOK_EXPREF]: 0,
	   [Token.TOK_ROOT]: 0,
	   [Token.TOK_PIPE]: 1,
	   [Token.TOK_OR]: 2,
	   [Token.TOK_AND]: 3,
	   [Token.TOK_EQ]: 5,
	   [Token.TOK_GT]: 5,
	   [Token.TOK_LT]: 5,
	   [Token.TOK_GTE]: 5,
	   [Token.TOK_LTE]: 5,
	   [Token.TOK_NE]: 5,
	   [Token.TOK_MINUS]: 6,
	   [Token.TOK_PLUS]: 6,
	   [Token.TOK_DIV]: 7,
	   [Token.TOK_DIVIDE]: 7,
	   [Token.TOK_MODULO]: 7,
	   [Token.TOK_MULTIPLY]: 7,
	   [Token.TOK_FLATTEN]: 9,
	   [Token.TOK_STAR]: 20,
	   [Token.TOK_FILTER]: 21,
	   [Token.TOK_DOT]: 40,
	   [Token.TOK_NOT]: 45,
	   [Token.TOK_LBRACE]: 50,
	   [Token.TOK_LBRACKET]: 55,
	   [Token.TOK_LPAREN]: 60,
   };
   class TokenParser {
	   constructor() {
		   this.index = 0;
		   this.tokens = [];
	   }
	   parse(expression, options) {
		   this.loadTokens(expression, options || { enable_legacy_literals: false, });
		   this.index = 0;
		   const ast = this.expression(0);
		   if (this.lookahead(0) !== Token.TOK_EOF) {
			   const token = this.lookaheadToken(0);
			   this.errorToken(token, `Syntax error: unexpected token type: ${token.type}, value: ${token.value}`);
		   }
		   return ast;
	   }
	   loadTokens(expression, options) {
		   this.tokens = [...Lexer.tokenize(expression, options), { type: Token.TOK_EOF, value: '', start: expression.length }];
	   }
	   expression(rbp) {
		   const leftToken = this.lookaheadToken(0);
		   this.advance();
		   let left = this.nud(leftToken);
		   let currentTokenType = this.lookahead(0);
		   while (rbp < bindingPower[currentTokenType]) {
			   this.advance();
			   left = this.led(currentTokenType, left);
			   currentTokenType = this.lookahead(0);
		   }
		   return left;
	   }
	   lookahead(offset) {
		   return this.tokens[this.index + offset].type;
	   }
	   lookaheadToken(offset) {
		   return this.tokens[this.index + offset];
	   }
	   advance() {
		   this.index += 1;
	   }
	   nud(token) {
		   switch (token.type) {
			   case Token.TOK_LITERAL:
				   return { type: 'Literal', value: token.value };
			   case Token.TOK_UNQUOTEDIDENTIFIER:
				   return { type: 'Field', name: token.value };
			   case Token.TOK_QUOTEDIDENTIFIER:
				   if (this.lookahead(0) === Token.TOK_LPAREN) {
					   throw new Error('Syntax error: quoted identifier not allowed for function names.');
				   }
				   else {
					   return { type: 'Field', name: token.value };
				   }
			   case Token.TOK_NOT: {
				   const child = this.expression(bindingPower.Not);
				   return { type: 'NotExpression', child };
			   }
			   case Token.TOK_MINUS: {
				   const child = this.expression(bindingPower.Minus);
				   return { type: 'Unary', operator: token.type, operand: child };
			   }
			   case Token.TOK_PLUS: {
				   const child = this.expression(bindingPower.Plus);
				   return { type: 'Unary', operator: token.type, operand: child };
			   }
			   case Token.TOK_STAR: {
				   const left = { type: 'Identity' };
				   const right = this.lookahead(0) === Token.TOK_RBRACKET ? left : this.parseProjectionRHS(bindingPower.Star);
				   return { type: 'ValueProjection', left, right };
			   }
			   case Token.TOK_FILTER:
				   return this.led(token.type, { type: 'Identity' });
			   case Token.TOK_LBRACE:
				   return this.parseMultiselectHash();
			   case Token.TOK_FLATTEN: {
				   const left = { type: 'Flatten', child: { type: 'Identity' } };
				   const right = this.parseProjectionRHS(bindingPower.Flatten);
				   return { type: 'Projection', left, right };
			   }
			   case Token.TOK_LBRACKET: {
				   if (this.lookahead(0) === Token.TOK_NUMBER || this.lookahead(0) === Token.TOK_COLON) {
					   const right = this.parseIndexExpression();
					   return this.projectIfSlice({ type: 'Identity' }, right);
				   }
				   if (this.lookahead(0) === Token.TOK_STAR && this.lookahead(1) === Token.TOK_RBRACKET) {
					   this.advance();
					   this.advance();
					   const right = this.parseProjectionRHS(bindingPower.Star);
					   return {
						   left: { type: 'Identity' },
						   right,
						   type: 'Projection',
					   };
				   }
				   return this.parseMultiselectList();
			   }
			   case Token.TOK_CURRENT:
				   return { type: Token.TOK_CURRENT };
			   case Token.TOK_ROOT:
				   return { type: Token.TOK_ROOT };
			   case Token.TOK_EXPREF: {
				   const child = this.expression(bindingPower.Expref);
				   return { type: 'ExpressionReference', child };
			   }
			   case Token.TOK_LPAREN: {
				   const args = [];
				   while (this.lookahead(0) !== Token.TOK_RPAREN) {
					   let expression;
					   if (this.lookahead(0) === Token.TOK_CURRENT) {
						   expression = { type: Token.TOK_CURRENT };
						   this.advance();
					   }
					   else {
						   expression = this.expression(0);
					   }
					   args.push(expression);
				   }
				   this.match(Token.TOK_RPAREN);
				   return args[0];
			   }
			   default:
				   this.errorToken(token);
		   }
	   }
	   led(tokenName, left) {
		   switch (tokenName) {
			   case Token.TOK_DOT: {
				   const rbp = bindingPower.Dot;
				   if (this.lookahead(0) !== Token.TOK_STAR) {
					   const right = this.parseDotRHS(rbp);
					   return { type: 'Subexpression', left, right };
				   }
				   this.advance();
				   const right = this.parseProjectionRHS(rbp);
				   return { type: 'ValueProjection', left, right };
			   }
			   case Token.TOK_PIPE: {
				   const right = this.expression(bindingPower.Pipe);
				   return { type: 'Pipe', left, right };
			   }
			   case Token.TOK_OR: {
				   const right = this.expression(bindingPower.Or);
				   return { type: 'OrExpression', left, right };
			   }
			   case Token.TOK_AND: {
				   const right = this.expression(bindingPower.And);
				   return { type: 'AndExpression', left, right };
			   }
			   case Token.TOK_LPAREN: {
				   if (left.type !== 'Field') {
					   throw new Error('Syntax error: expected a Field node');
				   }
				   const name = left.name;
				   const args = [];
				   let expression;
				   while (this.lookahead(0) !== Token.TOK_RPAREN) {
					   if (this.lookahead(0) === Token.TOK_CURRENT) {
						   expression = { type: Token.TOK_CURRENT };
						   this.advance();
					   }
					   else {
						   expression = this.expression(0);
					   }
					   if (this.lookahead(0) === Token.TOK_COMMA) {
						   this.match(Token.TOK_COMMA);
					   }
					   args.push(expression);
				   }
				   this.match(Token.TOK_RPAREN);
				   const node = { name, type: 'Function', children: args };
				   return node;
			   }
			   case Token.TOK_FILTER: {
				   const condition = this.expression(0);
				   this.match(Token.TOK_RBRACKET);
				   const right = this.lookahead(0) === Token.TOK_FLATTEN ? { type: 'Identity' } : this.parseProjectionRHS(bindingPower.Filter);
				   return { type: 'FilterProjection', left, right, condition };
			   }
			   case Token.TOK_FLATTEN: {
				   const leftNode = { type: 'Flatten', child: left };
				   const right = this.parseProjectionRHS(bindingPower.Flatten);
				   return { type: 'Projection', left: leftNode, right };
			   }
			   case Token.TOK_EQ:
			   case Token.TOK_NE:
			   case Token.TOK_GT:
			   case Token.TOK_GTE:
			   case Token.TOK_LT:
			   case Token.TOK_LTE:
				   return this.parseComparator(left, tokenName);
			   case Token.TOK_PLUS:
			   case Token.TOK_MINUS:
			   case Token.TOK_MULTIPLY:
			   case Token.TOK_STAR:
			   case Token.TOK_DIVIDE:
			   case Token.TOK_MODULO:
			   case Token.TOK_DIV:
				   return this.parseArithmetic(left, tokenName);
			   case Token.TOK_LBRACKET: {
				   const token = this.lookaheadToken(0);
				   if (token.type === Token.TOK_NUMBER || token.type === Token.TOK_COLON) {
					   const right = this.parseIndexExpression();
					   return this.projectIfSlice(left, right);
				   }
				   this.match(Token.TOK_STAR);
				   this.match(Token.TOK_RBRACKET);
				   const right = this.parseProjectionRHS(bindingPower.Star);
				   return { type: 'Projection', left, right };
			   }
			   default:
				   return this.errorToken(this.lookaheadToken(0));
		   }
	   }
	   match(tokenType) {
		   if (this.lookahead(0) === tokenType) {
			   this.advance();
			   return;
		   }
		   else {
			   const token = this.lookaheadToken(0);
			   this.errorToken(token, `Syntax error: expected ${tokenType}, got: ${token.type}`);
		   }
	   }
	   errorToken(token, message = '') {
		   const error = new Error(message || `Syntax error: invalid token (${token.type}): "${token.value}"`);
		   error.name = 'ParserError';
		   throw error;
	   }
	   parseIndexExpression() {
		   if (this.lookahead(0) === Token.TOK_COLON || this.lookahead(1) === Token.TOK_COLON) {
			   return this.parseSliceExpression();
		   }
		   const value = Number(this.lookaheadToken(0).value);
		   this.advance();
		   this.match(Token.TOK_RBRACKET);
		   return { type: 'Index', value };
	   }
	   projectIfSlice(left, right) {
		   const indexExpr = { type: 'IndexExpression', left, right };
		   if (right.type === 'Slice') {
			   return {
				   left: indexExpr,
				   right: this.parseProjectionRHS(bindingPower.Star),
				   type: 'Projection',
			   };
		   }
		   return indexExpr;
	   }
	   parseSliceExpression() {
		   const parts = [null, null, null];
		   let index = 0;
		   let current = this.lookaheadToken(0);
		   while (current.type != Token.TOK_RBRACKET && index < 3) {
			   if (current.type === Token.TOK_COLON) {
				   index++;
				   if (index === 3) {
					   this.errorToken(this.lookaheadToken(0), 'Syntax error, too many colons in slice expression');
				   }
				   this.advance();
			   }
			   else if (current.type === Token.TOK_NUMBER) {
				   const part = this.lookaheadToken(0).value;
				   parts[index] = part;
				   this.advance();
			   }
			   else {
				   const next = this.lookaheadToken(0);
				   this.errorToken(next, `Syntax error, unexpected token: ${next.value}(${next.type})`);
			   }
			   current = this.lookaheadToken(0);
		   }
		   this.match(Token.TOK_RBRACKET);
		   const [start = null, stop = null, step = null] = parts;
		   return { type: 'Slice', start, stop, step };
	   }
	   parseComparator(left, comparator) {
		   const right = this.expression(bindingPower[comparator]);
		   return { type: 'Comparator', name: comparator, left, right };
	   }
	   parseArithmetic(left, operator) {
		   const right = this.expression(bindingPower[operator]);
		   return { type: 'Arithmetic', operator: operator, left, right };
	   }
	   parseDotRHS(rbp) {
		   const lookahead = this.lookahead(0);
		   const exprTokens = [Token.TOK_UNQUOTEDIDENTIFIER, Token.TOK_QUOTEDIDENTIFIER, Token.TOK_STAR];
		   if (exprTokens.includes(lookahead)) {
			   return this.expression(rbp);
		   }
		   if (lookahead === Token.TOK_LBRACKET) {
			   this.match(Token.TOK_LBRACKET);
			   return this.parseMultiselectList();
		   }
		   if (lookahead === Token.TOK_LBRACE) {
			   this.match(Token.TOK_LBRACE);
			   return this.parseMultiselectHash();
		   }
		   const token = this.lookaheadToken(0);
		   this.errorToken(token, `Syntax error, unexpected token: ${token.value}(${token.type})`);
	   }
	   parseProjectionRHS(rbp) {
		   if (bindingPower[this.lookahead(0)] < 10) {
			   return { type: 'Identity' };
		   }
		   if (this.lookahead(0) === Token.TOK_LBRACKET) {
			   return this.expression(rbp);
		   }
		   if (this.lookahead(0) === Token.TOK_FILTER) {
			   return this.expression(rbp);
		   }
		   if (this.lookahead(0) === Token.TOK_DOT) {
			   this.match(Token.TOK_DOT);
			   return this.parseDotRHS(rbp);
		   }
		   const token = this.lookaheadToken(0);
		   this.errorToken(token, `Syntax error, unexpected token: ${token.value}(${token.type})`);
	   }
	   parseMultiselectList() {
		   const expressions = [];
		   while (this.lookahead(0) !== Token.TOK_RBRACKET) {
			   const expression = this.expression(0);
			   expressions.push(expression);
			   if (this.lookahead(0) === Token.TOK_COMMA) {
				   this.match(Token.TOK_COMMA);
				   if (this.lookahead(0) === Token.TOK_RBRACKET) {
					   throw new Error('Syntax error: unexpected token Rbracket');
				   }
			   }
		   }
		   this.match(Token.TOK_RBRACKET);
		   return { type: 'MultiSelectList', children: expressions };
	   }
	   parseMultiselectHash() {
		   const pairs = [];
		   const identifierTypes = [Token.TOK_UNQUOTEDIDENTIFIER, Token.TOK_QUOTEDIDENTIFIER];
		   let keyToken;
		   let keyName;
		   let value;
		   // tslint:disable-next-line: prettier
		   for (;;) {
			   keyToken = this.lookaheadToken(0);
			   if (!identifierTypes.includes(keyToken.type)) {
				   throw new Error(`Syntax error: expecting an identifier token, got: ${keyToken.type}`);
			   }
			   keyName = keyToken.value;
			   this.advance();
			   this.match(Token.TOK_COLON);
			   value = this.expression(0);
			   pairs.push({ value, type: 'KeyValuePair', name: keyName });
			   if (this.lookahead(0) === Token.TOK_COMMA) {
				   this.match(Token.TOK_COMMA);
			   }
			   else if (this.lookahead(0) === Token.TOK_RBRACE) {
				   this.match(Token.TOK_RBRACE);
				   break;
			   }
		   }
		   return { type: 'MultiSelectHash', children: pairs };
	   }
   }
   const Parser = new TokenParser();

   class Text {
	   constructor(text) {
		   this._text = text;
	   }
	   get string() {
		   return this._text;
	   }
	   get length() {
		   return this.codePoints.length;
	   }
	   compareTo(other) {
		   return Text.compare(this, new Text(other));
	   }
	   static get comparer() {
		   const stringComparer = (left, right) => {
			   return new Text(left).compareTo(right);
		   };
		   return stringComparer;
	   }
	   static compare(left, right) {
		   const leftCp = left.codePoints;
		   const rightCp = right.codePoints;
		   for (let index = 0; index < Math.min(leftCp.length, rightCp.length); index++) {
			   if (leftCp[index] === rightCp[index]) {
				   continue;
			   }
			   return (leftCp[index] - rightCp[index]) > 0 ? 1 : -1;
		   }
		   return (leftCp.length - rightCp.length) > 0 ? 1 : -1;
	   }
	   reverse() {
		   return String.fromCodePoint(...this.codePoints.reverse());
	   }
	   get codePoints() {
		   const array = [...this._text].map(s => s.codePointAt(0));
		   return array;
	   }
   }

   const findFirst = (subject, sub, start, end) => {
	   if (!subject || !sub) {
		   return null;
	   }
	   start = Math.max(ensureInteger((start = start || 0)), 0);
	   end = Math.min(ensureInteger((end = end || subject.length)), subject.length);
	   const offset = subject.slice(start, end).indexOf(sub);
	   return offset === -1 ? null : offset + start;
   };
   const findLast = (subject, sub, start, end) => {
	   if (!subject || !sub) {
		   return null;
	   }
	   start = Math.max(ensureInteger((start = start || 0)), 0);
	   end = Math.min(ensureInteger((end = end || subject.length)), subject.length);
	   const offset = subject.slice(start, end).lastIndexOf(sub);
	   const result = offset === -1 ? null : offset + start;
	   return result;
   };
   const lower = (subject) => subject.toLowerCase();
   const ensurePadFuncParams = (name, width, padding) => {
	   padding = padding || ' ';
	   if (padding.length > 1) {
		   throw new Error(`invalid value, ${name} expects its 'pad' parameter to be a valid string with a single codepoint`);
	   }
	   ensurePositiveInteger(width);
	   return padding;
   };
   const padLeft = (subject, width, padding) => {
	   padding = ensurePadFuncParams('pad_left', width, padding);
	   return (subject && subject.padStart(width, padding)) || '';
   };
   const padRight = (subject, width, padding) => {
	   padding = ensurePadFuncParams('pad_right', width, padding);
	   return (subject && subject.padEnd(width, padding)) || '';
   };
   const replace = (subject, string, by, count) => {
	   if (count === 0) {
		   return subject;
	   }
	   if (!count) {
		   // emulating es2021: String.prototype.replaceAll()
		   return subject.split(string).join(by);
	   }
	   ensurePositiveInteger(count);
	   [...Array(count).keys()].map(() => (subject = subject.replace(string, by)));
	   return subject;
   };
   const split = (subject, search, count) => {
	   if (subject.length == 0 && search.length === 0) {
		   return [];
	   }
	   if (count === null || count === undefined) {
		   return subject.split(search);
	   }
	   ensurePositiveInteger(count);
	   if (count === 0) {
		   return [subject];
	   }
	   const split = subject.split(search);
	   return [
		   ...split.slice(0, count),
		   split.slice(count).join(search)
	   ];
   };
   const trim = (subject, chars) => {
	   return trimLeft(trimRight(subject, chars), chars);
   };
   const trimLeft = (subject, chars) => {
	   return trimImpl(subject, list => new RegExp(`^[${list}]*(.*?)`), chars);
   };
   const trimRight = (subject, chars) => {
	   return trimImpl(subject, list => new RegExp(`(.*?)[${list}]*\$`), chars);
   };
   const trimImpl = (subject, regExper, chars) => {
	   const pattern = chars ? chars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') : '\\s\u0085';
	   return subject.replace(regExper(pattern), '$1');
   };
   const upper = (subject) => subject.toUpperCase();

   var InputArgument;
   (function (InputArgument) {
	   InputArgument[InputArgument["TYPE_NUMBER"] = 0] = "TYPE_NUMBER";
	   InputArgument[InputArgument["TYPE_ANY"] = 1] = "TYPE_ANY";
	   InputArgument[InputArgument["TYPE_STRING"] = 2] = "TYPE_STRING";
	   InputArgument[InputArgument["TYPE_ARRAY"] = 3] = "TYPE_ARRAY";
	   InputArgument[InputArgument["TYPE_OBJECT"] = 4] = "TYPE_OBJECT";
	   InputArgument[InputArgument["TYPE_BOOLEAN"] = 5] = "TYPE_BOOLEAN";
	   InputArgument[InputArgument["TYPE_EXPREF"] = 6] = "TYPE_EXPREF";
	   InputArgument[InputArgument["TYPE_NULL"] = 7] = "TYPE_NULL";
	   InputArgument[InputArgument["TYPE_ARRAY_NUMBER"] = 8] = "TYPE_ARRAY_NUMBER";
	   InputArgument[InputArgument["TYPE_ARRAY_STRING"] = 9] = "TYPE_ARRAY_STRING";
	   InputArgument[InputArgument["TYPE_ARRAY_OBJECT"] = 10] = "TYPE_ARRAY_OBJECT";
	   InputArgument[InputArgument["TYPE_ARRAY_ARRAY"] = 11] = "TYPE_ARRAY_ARRAY";
   })(InputArgument || (InputArgument = {}));
   class Runtime {
	   constructor(interpreter) {
		   this.TYPE_NAME_TABLE = {
			   [InputArgument.TYPE_NUMBER]: 'number',
			   [InputArgument.TYPE_ANY]: 'any',
			   [InputArgument.TYPE_STRING]: 'string',
			   [InputArgument.TYPE_ARRAY]: 'array',
			   [InputArgument.TYPE_OBJECT]: 'object',
			   [InputArgument.TYPE_BOOLEAN]: 'boolean',
			   [InputArgument.TYPE_EXPREF]: 'expression',
			   [InputArgument.TYPE_NULL]: 'null',
			   [InputArgument.TYPE_ARRAY_NUMBER]: 'Array<number>',
			   [InputArgument.TYPE_ARRAY_OBJECT]: 'Array<object>',
			   [InputArgument.TYPE_ARRAY_STRING]: 'Array<string>',
			   [InputArgument.TYPE_ARRAY_ARRAY]: 'Array<Array<any>>',
		   };
		   this.functionAbs = ([inputValue]) => {
			   return Math.abs(inputValue);
		   };
		   this.functionAvg = ([inputArray]) => {
			   if (!inputArray || inputArray.length == 0) {
				   return null;
			   }
			   let sum = 0;
			   for (let i = 0; i < inputArray.length; i += 1) {
				   sum += inputArray[i];
			   }
			   return sum / inputArray.length;
		   };
		   this.functionCeil = ([inputValue]) => {
			   return Math.ceil(inputValue);
		   };
		   this.functionContains = ([searchable, searchValue,]) => {
			   if (Array.isArray(searchable)) {
				   const array = searchable;
				   return array.includes(searchValue);
			   }
			   if (typeof searchable === 'string') {
				   const text = searchable;
				   if (typeof searchValue === 'string') {
					   return text.includes(searchValue);
				   }
			   }
			   return null;
		   };
		   this.functionEndsWith = resolvedArgs => {
			   const [searchStr, suffix] = resolvedArgs;
			   return searchStr.includes(suffix, searchStr.length - suffix.length);
		   };
		   this.functionFindFirst = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   const search = resolvedArgs[1];
			   const start = (resolvedArgs.length > 2 && resolvedArgs[2]) || undefined;
			   const end = (resolvedArgs.length > 3 && resolvedArgs[3]) || undefined;
			   return findFirst(subject, search, start, end);
		   };
		   this.functionFindLast = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   const search = resolvedArgs[1];
			   const start = (resolvedArgs.length > 2 && resolvedArgs[2]) || undefined;
			   const end = (resolvedArgs.length > 3 && resolvedArgs[3]) || undefined;
			   return findLast(subject, search, start, end);
		   };
		   this.functionFloor = ([inputValue]) => {
			   return Math.floor(inputValue);
		   };
		   this.functionFromItems = ([array]) => {
			   array.map((pair) => {
				   if (pair.length != 2 || typeof pair[0] !== 'string') {
					   throw new Error('invalid value, each array must contain two elements, a pair of string and value');
				   }
			   });
			   return Object.fromEntries(array);
		   };
		   this.functionGroupBy = ([array, exprefNode]) => {
			   const keyFunction = this.createKeyFunction(exprefNode, [InputArgument.TYPE_STRING]);
			   return array.reduce((acc, cur) => {
				   const k = keyFunction(cur !== null && cur !== void 0 ? cur : {});
				   const target = (acc[k] = acc[k] || []);
				   target.push(cur);
				   return acc;
			   }, {});
		   };
		   this.functionItems = ([inputValue]) => {
			   return Object.entries(inputValue);
		   };
		   this.functionJoin = resolvedArgs => {
			   const [joinChar, listJoin] = resolvedArgs;
			   return listJoin.join(joinChar);
		   };
		   this.functionKeys = ([inputObject]) => {
			   return Object.keys(inputObject);
		   };
		   this.functionLength = ([inputValue]) => {
			   if (typeof inputValue === 'string') {
				   return new Text(inputValue).length;
			   }
			   if (Array.isArray(inputValue)) {
				   return inputValue.length;
			   }
			   return Object.keys(inputValue).length;
		   };
		   this.functionLet = ([inputScope, exprefNode]) => {
			   var _a;
			   const interpreter = (_a = this._interpreter) === null || _a === void 0 ? void 0 : _a.withScope(inputScope);
			   return interpreter.visit(exprefNode, exprefNode.context);
		   };
		   this.functionLower = ([subject]) => {
			   return lower(subject);
		   };
		   this.functionMap = ([exprefNode, elements]) => {
			   if (!this._interpreter) {
				   return [];
			   }
			   const mapped = [];
			   const interpreter = this._interpreter;
			   for (let i = 0; i < elements.length; i += 1) {
				   mapped.push(interpreter.visit(exprefNode, elements[i]));
			   }
			   return mapped;
		   };
		   this.functionMax = ([inputValue]) => {
			   if (!inputValue.length) {
				   return null;
			   }
			   const typeName = this.getTypeName(inputValue[0]);
			   if (typeName === InputArgument.TYPE_NUMBER) {
				   return Math.max(...inputValue);
			   }
			   const elements = inputValue;
			   let maxElement = elements[0];
			   for (let i = 1; i < elements.length; i += 1) {
				   if (maxElement.localeCompare(elements[i]) < 0) {
					   maxElement = elements[i];
				   }
			   }
			   return maxElement;
		   };
		   this.functionMaxBy = resolvedArgs => {
			   const exprefNode = resolvedArgs[1];
			   const resolvedArray = resolvedArgs[0];
			   const keyFunction = this.createKeyFunction(exprefNode, [InputArgument.TYPE_NUMBER, InputArgument.TYPE_STRING]);
			   let maxNumber = -Infinity;
			   let maxRecord;
			   let current;
			   for (let i = 0; i < resolvedArray.length; i += 1) {
				   current = keyFunction && keyFunction(resolvedArray[i]);
				   if (current !== undefined && current > maxNumber) {
					   maxNumber = current;
					   maxRecord = resolvedArray[i];
				   }
			   }
			   return maxRecord || null;
		   };
		   this.functionMerge = resolvedArgs => {
			   let merged = {};
			   for (let i = 0; i < resolvedArgs.length; i += 1) {
				   const current = resolvedArgs[i];
				   merged = Object.assign(merged, current);
			   }
			   return merged;
		   };
		   this.functionMin = ([inputValue]) => {
			   if (!inputValue.length) {
				   return null;
			   }
			   const typeName = this.getTypeName(inputValue[0]);
			   if (typeName === InputArgument.TYPE_NUMBER) {
				   return Math.min(...inputValue);
			   }
			   const elements = inputValue;
			   let minElement = elements[0];
			   for (let i = 1; i < elements.length; i += 1) {
				   if (elements[i].localeCompare(minElement) < 0) {
					   minElement = elements[i];
				   }
			   }
			   return minElement;
		   };
		   this.functionMinBy = resolvedArgs => {
			   const exprefNode = resolvedArgs[1];
			   const resolvedArray = resolvedArgs[0];
			   const keyFunction = this.createKeyFunction(exprefNode, [InputArgument.TYPE_NUMBER, InputArgument.TYPE_STRING]);
			   let minNumber = Infinity;
			   let minRecord;
			   let current;
			   for (let i = 0; i < resolvedArray.length; i += 1) {
				   current = keyFunction && keyFunction(resolvedArray[i]);
				   if (current !== undefined && current < minNumber) {
					   minNumber = current;
					   minRecord = resolvedArray[i];
				   }
			   }
			   return minRecord || null;
		   };
		   this.functionNotNull = resolvedArgs => {
			   for (let i = 0; i < resolvedArgs.length; i += 1) {
				   if (this.getTypeName(resolvedArgs[i]) !== InputArgument.TYPE_NULL) {
					   return resolvedArgs[i];
				   }
			   }
			   return null;
		   };
		   this.functionPadLeft = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   const width = resolvedArgs[1];
			   const padding = (resolvedArgs.length > 2 && resolvedArgs[2]) || undefined;
			   return padLeft(subject, width, padding);
		   };
		   this.functionPadRight = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   const width = resolvedArgs[1];
			   const padding = (resolvedArgs.length > 2 && resolvedArgs[2]) || undefined;
			   return padRight(subject, width, padding);
		   };
		   this.functionReplace = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   const string = resolvedArgs[1];
			   const by = resolvedArgs[2];
			   return replace(subject, string, by, resolvedArgs.length > 3 ? resolvedArgs[3] : undefined);
		   };
		   this.functionSplit = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   const search = resolvedArgs[1];
			   return split(subject, search, resolvedArgs.length > 2 ? resolvedArgs[2] : undefined);
		   };
		   this.functionReverse = ([inputValue]) => {
			   const typeName = this.getTypeName(inputValue);
			   if (typeName === InputArgument.TYPE_STRING) {
				   return new Text(inputValue)
					   .reverse();
			   }
			   const reversedArray = inputValue.slice(0);
			   reversedArray.reverse();
			   return reversedArray;
		   };
		   this.functionSort = ([inputValue]) => {
			   if (inputValue.length == 0) {
				   return inputValue;
			   }
			   if (typeof inputValue[0] === 'string') {
				   return [...inputValue].sort(Text.comparer);
			   }
			   return [...inputValue].sort();
		   };
		   this.functionSortBy = resolvedArgs => {
			   const sortedArray = resolvedArgs[0].slice(0);
			   if (sortedArray.length === 0) {
				   return sortedArray;
			   }
			   const interpreter = this._interpreter;
			   const exprefNode = resolvedArgs[1];
			   const requiredType = this.getTypeName(interpreter.visit(exprefNode, sortedArray[0]));
			   if (requiredType !== undefined && ![InputArgument.TYPE_NUMBER, InputArgument.TYPE_STRING].includes(requiredType)) {
				   throw new Error(`Invalid type: unexpected type (${this.TYPE_NAME_TABLE[requiredType]})`);
			   }
			   function throwInvalidTypeError(rt, item) {
				   throw new Error(`Invalid type: expected (${rt.TYPE_NAME_TABLE[requiredType]}), received ${rt.TYPE_NAME_TABLE[rt.getTypeName(item)]}`);
			   }
			   return sortedArray.sort((a, b) => {
				   const exprA = interpreter.visit(exprefNode, a);
				   const exprB = interpreter.visit(exprefNode, b);
				   if (this.getTypeName(exprA) !== requiredType) {
					   throwInvalidTypeError(this, exprA);
				   }
				   else if (this.getTypeName(exprB) !== requiredType) {
					   throwInvalidTypeError(this, exprB);
				   }
				   if (requiredType === InputArgument.TYPE_STRING) {
					   return Text.comparer(exprA, exprB);
				   }
				   return exprA - exprB;
			   });
		   };
		   this.functionStartsWith = ([searchable, searchStr]) => {
			   return searchable.startsWith(searchStr);
		   };
		   this.functionSum = ([inputValue]) => {
			   return inputValue.reduce((x, y) => x + y, 0);
		   };
		   this.functionToArray = ([inputValue]) => {
			   if (this.getTypeName(inputValue) === InputArgument.TYPE_ARRAY) {
				   return inputValue;
			   }
			   return [inputValue];
		   };
		   this.functionToNumber = ([inputValue]) => {
			   const typeName = this.getTypeName(inputValue);
			   let convertedValue;
			   if (typeName === InputArgument.TYPE_NUMBER) {
				   return inputValue;
			   }
			   if (typeName === InputArgument.TYPE_STRING) {
				   convertedValue = +inputValue;
				   if (!isNaN(convertedValue)) {
					   return convertedValue;
				   }
			   }
			   return null;
		   };
		   this.functionToString = ([inputValue]) => {
			   if (this.getTypeName(inputValue) === InputArgument.TYPE_STRING) {
				   return inputValue;
			   }
			   return JSON.stringify(inputValue);
		   };
		   this.functionTrim = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   return trim(subject, resolvedArgs.length > 1 ? resolvedArgs[1] : undefined);
		   };
		   this.functionTrimLeft = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   return trimLeft(subject, resolvedArgs.length > 1 ? resolvedArgs[1] : undefined);
		   };
		   this.functionTrimRight = resolvedArgs => {
			   const subject = resolvedArgs[0];
			   return trimRight(subject, resolvedArgs.length > 1 ? resolvedArgs[1] : undefined);
		   };
		   this.functionType = ([inputValue]) => {
			   switch (this.getTypeName(inputValue)) {
				   case InputArgument.TYPE_NUMBER:
					   return 'number';
				   case InputArgument.TYPE_STRING:
					   return 'string';
				   case InputArgument.TYPE_ARRAY:
					   return 'array';
				   case InputArgument.TYPE_OBJECT:
					   return 'object';
				   case InputArgument.TYPE_BOOLEAN:
					   return 'boolean';
				   case InputArgument.TYPE_NULL:
					   return 'null';
				   default:
					   throw new Error('invalid-type');
			   }
		   };
		   this.functionUpper = ([subject]) => {
			   return upper(subject);
		   };
		   this.functionValues = ([inputObject]) => {
			   return Object.values(inputObject);
		   };
		   this.functionZip = array => {
			   const length = Math.min(...array.map(arr => arr.length));
			   const result = Array(length)
				   .fill(null)
				   .map((_, index) => array.map(arr => arr[index]));
			   return result;
		   };
		   this.functionTable = {
			   abs: {
				   _func: this.functionAbs,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_NUMBER],
					   },
				   ],
			   },
			   avg: {
				   _func: this.functionAvg,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY_NUMBER],
					   },
				   ],
			   },
			   ceil: {
				   _func: this.functionCeil,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_NUMBER],
					   },
				   ],
			   },
			   contains: {
				   _func: this.functionContains,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING, InputArgument.TYPE_ARRAY],
					   },
					   {
						   types: [InputArgument.TYPE_ANY],
					   },
				   ],
			   },
			   ends_with: {
				   _func: this.functionEndsWith,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
				   ],
			   },
			   find_first: {
				   _func: this.functionFindFirst,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
						   optional: true,
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
						   optional: true,
					   },
				   ],
			   },
			   find_last: {
				   _func: this.functionFindLast,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
						   optional: true,
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
						   optional: true,
					   },
				   ],
			   },
			   floor: {
				   _func: this.functionFloor,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_NUMBER],
					   },
				   ],
			   },
			   from_items: {
				   _func: this.functionFromItems,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY_ARRAY],
					   },
				   ],
			   },
			   group_by: {
				   _func: this.functionGroupBy,
				   _signature: [{ types: [InputArgument.TYPE_ARRAY] }, { types: [InputArgument.TYPE_EXPREF] }],
			   },
			   items: {
				   _func: this.functionItems,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_OBJECT],
					   },
				   ],
			   },
			   join: {
				   _func: this.functionJoin,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_ARRAY_STRING],
					   },
				   ],
			   },
			   keys: {
				   _func: this.functionKeys,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_OBJECT],
					   },
				   ],
			   },
			   let: {
				   _func: this.functionLet,
				   _signature: [{ types: [InputArgument.TYPE_OBJECT] }, { types: [InputArgument.TYPE_EXPREF] }],
			   },
			   length: {
				   _func: this.functionLength,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING, InputArgument.TYPE_ARRAY, InputArgument.TYPE_OBJECT],
					   },
				   ],
			   },
			   lower: {
				   _func: this.functionLower,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
				   ],
			   },
			   map: {
				   _func: this.functionMap,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_EXPREF],
					   },
					   {
						   types: [InputArgument.TYPE_ARRAY],
					   },
				   ],
			   },
			   max: {
				   _func: this.functionMax,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY_NUMBER, InputArgument.TYPE_ARRAY_STRING],
					   },
				   ],
			   },
			   max_by: {
				   _func: this.functionMaxBy,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY],
					   },
					   {
						   types: [InputArgument.TYPE_EXPREF],
					   },
				   ],
			   },
			   merge: {
				   _func: this.functionMerge,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_OBJECT],
						   variadic: true,
					   },
				   ],
			   },
			   min: {
				   _func: this.functionMin,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY_NUMBER, InputArgument.TYPE_ARRAY_STRING],
					   },
				   ],
			   },
			   min_by: {
				   _func: this.functionMinBy,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY],
					   },
					   {
						   types: [InputArgument.TYPE_EXPREF],
					   },
				   ],
			   },
			   not_null: {
				   _func: this.functionNotNull,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ANY],
						   variadic: true,
					   },
				   ],
			   },
			   pad_left: {
				   _func: this.functionPadLeft,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
						   optional: true,
					   },
				   ],
			   },
			   pad_right: {
				   _func: this.functionPadRight,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
						   optional: true,
					   },
				   ],
			   },
			   replace: {
				   _func: this.functionReplace,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
						   optional: true,
					   },
				   ],
			   },
			   split: {
				   _func: this.functionSplit,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_NUMBER],
						   optional: true,
					   },
				   ],
			   },
			   reverse: {
				   _func: this.functionReverse,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING, InputArgument.TYPE_ARRAY],
					   },
				   ],
			   },
			   sort: {
				   _func: this.functionSort,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY_STRING, InputArgument.TYPE_ARRAY_NUMBER],
					   },
				   ],
			   },
			   sort_by: {
				   _func: this.functionSortBy,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY],
					   },
					   {
						   types: [InputArgument.TYPE_EXPREF],
					   },
				   ],
			   },
			   starts_with: {
				   _func: this.functionStartsWith,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
				   ],
			   },
			   sum: {
				   _func: this.functionSum,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY_NUMBER],
					   },
				   ],
			   },
			   to_array: {
				   _func: this.functionToArray,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ANY],
					   },
				   ],
			   },
			   to_number: {
				   _func: this.functionToNumber,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ANY],
					   },
				   ],
			   },
			   to_string: {
				   _func: this.functionToString,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ANY],
					   },
				   ],
			   },
			   trim: {
				   _func: this.functionTrim,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
						   optional: true,
					   },
				   ],
			   },
			   trim_left: {
				   _func: this.functionTrimLeft,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
						   optional: true,
					   },
				   ],
			   },
			   trim_right: {
				   _func: this.functionTrimRight,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
					   {
						   types: [InputArgument.TYPE_STRING],
						   optional: true,
					   },
				   ],
			   },
			   type: {
				   _func: this.functionType,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ANY],
					   },
				   ],
			   },
			   upper: {
				   _func: this.functionUpper,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_STRING],
					   },
				   ],
			   },
			   values: {
				   _func: this.functionValues,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_OBJECT],
					   },
				   ],
			   },
			   zip: {
				   _func: this.functionZip,
				   _signature: [
					   {
						   types: [InputArgument.TYPE_ARRAY],
						   variadic: true,
					   },
				   ],
			   },
		   };
		   this._interpreter = interpreter;
	   }
	   registerFunction(name, customFunction, signature) {
		   if (name in this.functionTable) {
			   throw new Error(`Function already defined: ${name}()`);
		   }
		   this.functionTable[name] = {
			   _func: customFunction.bind(this),
			   _signature: signature,
		   };
	   }
	   callFunction(name, resolvedArgs) {
		   const functionEntry = this.functionTable[name];
		   if (functionEntry === undefined) {
			   throw new Error(`Unknown function: ${name}()`);
		   }
		   this.validateArgs(name, resolvedArgs, functionEntry._signature);
		   return functionEntry._func.call(this, resolvedArgs);
	   }
	   validateInputSignatures(name, signature) {
		   for (let i = 0; i < signature.length; i += 1) {
			   if ('variadic' in signature[i] && i !== signature.length - 1) {
				   throw new Error(`Invalid arity: ${name}() 'variadic' argument ${i + 1} must occur last`);
			   }
		   }
	   }
	   validateArgs(name, args, signature) {
		   var _a, _b;
		   let pluralized;
		   this.validateInputSignatures(name, signature);
		   const numberOfRequiredArgs = signature.filter(argSignature => { var _a; return (_a = !argSignature.optional) !== null && _a !== void 0 ? _a : false; }).length;
		   const lastArgIsVariadic = (_b = (_a = signature[signature.length - 1]) === null || _a === void 0 ? void 0 : _a.variadic) !== null && _b !== void 0 ? _b : false;
		   const tooFewArgs = args.length < numberOfRequiredArgs;
		   const tooManyArgs = args.length > signature.length;
		   const tooFewModifier = tooFewArgs && ((!lastArgIsVariadic && numberOfRequiredArgs > 1) || lastArgIsVariadic) ? 'at least ' : '';
		   if ((lastArgIsVariadic && tooFewArgs) || (!lastArgIsVariadic && (tooFewArgs || tooManyArgs))) {
			   pluralized = signature.length > 1;
			   throw new Error(`Invalid arity: ${name}() takes ${tooFewModifier}${numberOfRequiredArgs} argument${(pluralized && 's') || ''} but received ${args.length}`);
		   }
		   let currentSpec;
		   let actualType;
		   let typeMatched;
		   for (let i = 0; i < signature.length; i += 1) {
			   typeMatched = false;
			   currentSpec = signature[i].types;
			   actualType = this.getTypeName(args[i]);
			   let j;
			   for (j = 0; j < currentSpec.length; j += 1) {
				   if (actualType !== undefined && this.typeMatches(actualType, currentSpec[j], args[i])) {
					   typeMatched = true;
					   break;
				   }
			   }
			   if (!typeMatched && actualType !== undefined) {
				   const expected = currentSpec
					   .map((typeIdentifier) => {
					   return this.TYPE_NAME_TABLE[typeIdentifier];
				   })
					   .join(' | ');
				   throw new Error(`Invalid type: ${name}() expected argument ${i + 1} to be type (${expected}) but received type ${this.TYPE_NAME_TABLE[actualType]} instead.`);
			   }
		   }
	   }
	   typeMatches(actual, expected, argValue) {
		   if (expected === InputArgument.TYPE_ANY) {
			   return true;
		   }
		   if (expected === InputArgument.TYPE_ARRAY_STRING ||
			   expected === InputArgument.TYPE_ARRAY_NUMBER ||
			   expected === InputArgument.TYPE_ARRAY_OBJECT ||
			   expected === InputArgument.TYPE_ARRAY_ARRAY ||
			   expected === InputArgument.TYPE_ARRAY) {
			   if (expected === InputArgument.TYPE_ARRAY) {
				   return actual === InputArgument.TYPE_ARRAY;
			   }
			   if (actual === InputArgument.TYPE_ARRAY) {
				   let subtype;
				   if (expected === InputArgument.TYPE_ARRAY_NUMBER) {
					   subtype = InputArgument.TYPE_NUMBER;
				   }
				   else if (expected === InputArgument.TYPE_ARRAY_OBJECT) {
					   subtype = InputArgument.TYPE_OBJECT;
				   }
				   else if (expected === InputArgument.TYPE_ARRAY_STRING) {
					   subtype = InputArgument.TYPE_STRING;
				   }
				   else if (expected === InputArgument.TYPE_ARRAY_ARRAY) {
					   subtype = InputArgument.TYPE_ARRAY;
				   }
				   const array = argValue;
				   for (let i = 0; i < array.length; i += 1) {
					   const typeName = this.getTypeName(array[i]);
					   if (typeName !== undefined && subtype !== undefined && !this.typeMatches(typeName, subtype, array[i])) {
						   return false;
					   }
				   }
				   return true;
			   }
		   }
		   else {
			   return actual === expected;
		   }
		   return false;
	   }
	   getTypeName(obj) {
		   switch (Object.prototype.toString.call(obj)) {
			   case '[object String]':
				   return InputArgument.TYPE_STRING;
			   case '[object Number]':
				   return InputArgument.TYPE_NUMBER;
			   case '[object Array]':
				   return InputArgument.TYPE_ARRAY;
			   case '[object Boolean]':
				   return InputArgument.TYPE_BOOLEAN;
			   case '[object Null]':
				   return InputArgument.TYPE_NULL;
			   case '[object Object]':
				   if (obj.expref) {
					   return InputArgument.TYPE_EXPREF;
				   }
				   return InputArgument.TYPE_OBJECT;
			   default:
				   return;
		   }
	   }
	   createKeyFunction(exprefNode, allowedTypes) {
		   const interpreter = this._interpreter;
		   const keyFunc = (x) => {
			   const current = interpreter.visit(exprefNode, x);
			   if (!allowedTypes.includes(this.getTypeName(current))) {
				   const msg = `Invalid type: expected one of (${allowedTypes
					 .map(t => this.TYPE_NAME_TABLE[t])
					 .join(' | ')}), received ${this.TYPE_NAME_TABLE[this.getTypeName(current)]}`;
				   throw new Error(msg);
			   }
			   return current;
		   };
		   return keyFunc;
	   }
   }

   class ScopeChain {
	   constructor() {
		   this.inner = undefined;
		   this.data = {};
	   }
	   withScope(data) {
		   const outer = new ScopeChain();
		   outer.inner = this;
		   outer.data = data;
		   return outer;
	   }
	   getValue(identifier) {
		   if (identifier in this.data) {
			   const result = this.data[identifier];
			   if (result) {
				   return result;
			   }
		   }
		   if (this.inner) {
			   return this.inner.getValue(identifier);
		   }
		   return null;
	   }
   }

   class TreeInterpreter$1 {
	   constructor() {
		   this._rootValue = null;
		   this._scope = undefined;
		   this.runtime = new Runtime(this);
	   }
	   withScope(scope) {
		   var _a;
		   const interpreter = new TreeInterpreter$1();
		   interpreter._rootValue = this._rootValue;
		   interpreter._scope = (_a = this._scope) === null || _a === void 0 ? void 0 : _a.withScope(scope);
		   return interpreter;
	   }
	   search(node, value) {
		   this._rootValue = value;
		   this._scope = new ScopeChain();
		   return this.visit(node, value);
	   }
	   visit(node, value) {
		   var _a, _b, _c, _d;
		   switch (node.type) {
			   case 'Field':
				   const identifier = node.name;
				   let result = null;
				   if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
					   result = (_a = value[identifier]) !== null && _a !== void 0 ? _a : null;
				   }
				   if (result == null) {
					   result = (_c = (_b = this._scope) === null || _b === void 0 ? void 0 : _b.getValue(identifier)) !== null && _c !== void 0 ? _c : null;
				   }
				   return result;
			   case 'IndexExpression':
				   return this.visit(node.right, this.visit(node.left, value));
			   case 'Subexpression': {
				   const result = this.visit(node.left, value);
				   return result != null && this.visit(node.right, result) || null;
			   }
			   case 'Index': {
				   if (!Array.isArray(value)) {
					   return null;
				   }
				   const index = node.value < 0 ? value.length + node.value : node.value;
				   return (_d = value[index]) !== null && _d !== void 0 ? _d : null;
			   }
			   case 'Slice': {
				   if (!Array.isArray(value) && typeof value !== 'string') {
					   return null;
				   }
				   const { start, stop, step } = this.computeSliceParams(value.length, node);
				   if (typeof value === 'string') {
					   // string slices is implemented by slicing
					   // the corresponding array of codepoints and
					   // converting the result back to a string
					   const chars = [...value];
					   const sliced = this.slice(chars, start, stop, step);
					   return sliced.join('');
				   }
				   else {
					   return this.slice(value, start, stop, step);
				   }
			   }
			   case 'Projection': {
				   const { left, right } = node;
				   // projections typically operate on arrays
				   // string slicing produces a 'Projection' whose
				   // first child is an 'IndexExpression' whose
				   // second child is an 'Slice'
				   // we allow execution of the left index-expression
				   // to return a string only if the AST has this
				   // specific shape
				   let allowString = false;
				   if (left.type === 'IndexExpression' && left.right.type === 'Slice') {
					   allowString = true;
				   }
				   const base = this.visit(left, value);
				   if (allowString && typeof base === 'string') {
					   return base;
				   }
				   if (!Array.isArray(base)) {
					   return null;
				   }
				   const collected = [];
				   for (const elem of base) {
					   const current = this.visit(right, elem);
					   if (current !== null) {
						   collected.push(current);
					   }
				   }
				   return collected;
			   }
			   case 'ValueProjection': {
				   const { left, right } = node;
				   const base = this.visit(left, value);
				   if (base === null || typeof base !== 'object' || Array.isArray(base)) {
					   return null;
				   }
				   const collected = [];
				   const values = Object.values(base);
				   for (const elem of values) {
					   const current = this.visit(right, elem);
					   if (current !== null) {
						   collected.push(current);
					   }
				   }
				   return collected;
			   }
			   case 'FilterProjection': {
				   const { left, right, condition } = node;
				   const base = this.visit(left, value);
				   if (!Array.isArray(base)) {
					   return null;
				   }
				   const results = [];
				   for (const elem of base) {
					   const matched = this.visit(condition, elem);
					   if (isFalse(matched)) {
						   continue;
					   }
					   const result = this.visit(right, elem);
					   if (result !== null) {
						   results.push(result);
					   }
				   }
				   return results;
			   }
			   case 'Arithmetic': {
				   const first = this.visit(node.left, value);
				   const second = this.visit(node.right, value);
				   switch (node.operator) {
					   case Token.TOK_PLUS:
						   return add(first, second);
					   case Token.TOK_MINUS:
						   return sub(first, second);
					   case Token.TOK_MULTIPLY:
					   case Token.TOK_STAR:
						   return mul(first, second);
					   case Token.TOK_DIVIDE:
						   return divide(first, second);
					   case Token.TOK_MODULO:
						   return mod(first, second);
					   case Token.TOK_DIV:
						   return div(first, second);
					   default:
						   throw new Error(`Syntax error: unknown arithmetic operator: ${node.operator}`);
				   }
			   }
			   case 'Unary': {
				   const operand = this.visit(node.operand, value);
				   switch (node.operator) {
					   case Token.TOK_PLUS:
						   ensureNumbers(operand);
						   return operand;
					   case Token.TOK_MINUS:
						   ensureNumbers(operand);
						   return -operand;
					   default:
						   throw new Error(`Syntax error: unknown arithmetic operator: ${node.operator}`);
				   }
			   }
			   case 'Comparator': {
				   const first = this.visit(node.left, value);
				   const second = this.visit(node.right, value);
				   // equality is an exact match
				   switch (node.name) {
					   case 'EQ':
						   return strictDeepEqual(first, second);
					   case 'NE':
						   return !strictDeepEqual(first, second);
				   }
				   // ordering operators are only valid for numbers
				   if (typeof first !== 'number' || typeof second !== 'number') {
					   return null;
				   }
				   switch (node.name) {
					   case 'GT':
						   return first > second;
					   case 'GTE':
						   return first >= second;
					   case 'LT':
						   return first < second;
					   case 'LTE':
						   return first <= second;
				   }
			   }
			   case 'Flatten': {
				   const original = this.visit(node.child, value);
				   return Array.isArray(original) ? original.flat() : null;
			   }
			   case 'Root':
				   return this._rootValue;
			   case 'MultiSelectList': {
				   const collected = [];
				   for (const child of node.children) {
					   collected.push(this.visit(child, value));
				   }
				   return collected;
			   }
			   case 'MultiSelectHash': {
				   const collected = {};
				   for (const child of node.children) {
					   collected[child.name] = this.visit(child.value, value);
				   }
				   return collected;
			   }
			   case 'OrExpression': {
				   const result = this.visit(node.left, value);
				   if (isFalse(result)) {
					   return this.visit(node.right, value);
				   }
				   return result;
			   }
			   case 'AndExpression': {
				   const result = this.visit(node.left, value);
				   if (isFalse(result)) {
					   return result;
				   }
				   return this.visit(node.right, value);
			   }
			   case 'NotExpression':
				   return isFalse(this.visit(node.child, value));
			   case 'Literal':
				   return node.value;
			   case 'Pipe':
				   return this.visit(node.right, this.visit(node.left, value));
			   case 'Function': {
				   const args = [];
				   for (const child of node.children) {
					   args.push(this.visit(child, value));
				   }
				   return this.runtime.callFunction(node.name, args);
			   }
			   case 'ExpressionReference':
				   return Object.assign({ expref: true, context: value }, node.child);
			   case 'Current':
			   case 'Identity':
				   return value;
		   }
	   }
	   computeSliceParams(arrayLength, sliceNode) {
		   let { start, stop, step } = sliceNode;
		   if (step === null) {
			   step = 1;
		   }
		   else if (step === 0) {
			   const error = new Error('Invalid value: slice step cannot be 0');
			   error.name = 'RuntimeError';
			   throw error;
		   }
		   start = start === null ? (step < 0 ? arrayLength - 1 : 0) : this.capSliceRange(arrayLength, start, step);
		   stop = stop === null ? (step < 0 ? -1 : arrayLength) : this.capSliceRange(arrayLength, stop, step);
		   return { start, stop, step };
	   }
	   capSliceRange(arrayLength, actualValue, step) {
		   let nextActualValue = actualValue;
		   if (nextActualValue < 0) {
			   nextActualValue += arrayLength;
			   if (nextActualValue < 0) {
				   nextActualValue = step < 0 ? -1 : 0;
			   }
		   }
		   else if (nextActualValue >= arrayLength) {
			   nextActualValue = step < 0 ? arrayLength - 1 : arrayLength;
		   }
		   return nextActualValue;
	   }
	   slice(collection, start, end, step) {
		   const result = [];
		   if (step > 0) {
			   for (let i = start; i < end; i += step) {
				   result.push(collection[i]);
			   }
		   }
		   else {
			   for (let i = start; i > end; i += step) {
				   result.push(collection[i]);
			   }
		   }
		   return result;
	   }
   }
   const TreeInterpreterInstance = new TreeInterpreter$1();

   const TYPE_ANY = InputArgument.TYPE_ANY;
   const TYPE_ARRAY = InputArgument.TYPE_ARRAY;
   const TYPE_ARRAY_ARRAY = InputArgument.TYPE_ARRAY_ARRAY;
   const TYPE_ARRAY_NUMBER = InputArgument.TYPE_ARRAY_NUMBER;
   const TYPE_ARRAY_OBJECT = InputArgument.TYPE_ARRAY_OBJECT;
   const TYPE_ARRAY_STRING = InputArgument.TYPE_ARRAY_STRING;
   const TYPE_BOOLEAN = InputArgument.TYPE_BOOLEAN;
   const TYPE_EXPREF = InputArgument.TYPE_EXPREF;
   const TYPE_NULL = InputArgument.TYPE_NULL;
   const TYPE_NUMBER = InputArgument.TYPE_NUMBER;
   const TYPE_OBJECT = InputArgument.TYPE_OBJECT;
   const TYPE_STRING = InputArgument.TYPE_STRING;
   function compile(expression, options) {
	   const nodeTree = Parser.parse(expression, options);
	   return nodeTree;
   }
   function tokenize(expression, options) {
	   return Lexer.tokenize(expression, options);
   }
   const registerFunction = (functionName,
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   customFunction, signature) => {
	   TreeInterpreterInstance.runtime.registerFunction(functionName, customFunction, signature);
   };
   function search(data, expression, options) {
	   const nodeTree = Parser.parse(expression, options);
	   return TreeInterpreterInstance.search(nodeTree, data);
   }
   function Scope() {
	   return new ScopeChain();
   }
   const TreeInterpreter = TreeInterpreterInstance;
   const jmespath = {
	   compile,
	   registerFunction,
	   search,
	   tokenize,
	   TreeInterpreter,
	   TYPE_ANY,
	   TYPE_ARRAY_NUMBER,
	   TYPE_ARRAY_STRING,
	   TYPE_ARRAY,
	   TYPE_BOOLEAN,
	   TYPE_EXPREF,
	   TYPE_NULL,
	   TYPE_NUMBER,
	   TYPE_OBJECT,
	   TYPE_STRING,
   };

   exports.Scope = Scope;
   exports.TYPE_ANY = TYPE_ANY;
   exports.TYPE_ARRAY = TYPE_ARRAY;
   exports.TYPE_ARRAY_ARRAY = TYPE_ARRAY_ARRAY;
   exports.TYPE_ARRAY_NUMBER = TYPE_ARRAY_NUMBER;
   exports.TYPE_ARRAY_OBJECT = TYPE_ARRAY_OBJECT;
   exports.TYPE_ARRAY_STRING = TYPE_ARRAY_STRING;
   exports.TYPE_BOOLEAN = TYPE_BOOLEAN;
   exports.TYPE_EXPREF = TYPE_EXPREF;
   exports.TYPE_NULL = TYPE_NULL;
   exports.TYPE_NUMBER = TYPE_NUMBER;
   exports.TYPE_OBJECT = TYPE_OBJECT;
   exports.TYPE_STRING = TYPE_STRING;
   exports.TreeInterpreter = TreeInterpreter;
   exports.compile = compile;
   exports["default"] = jmespath;
   exports.jmespath = jmespath;
   exports.registerFunction = registerFunction;
   exports.search = search;
   exports.tokenize = tokenize;

   Object.defineProperty(exports, '__esModule', { value: true });

 }));
