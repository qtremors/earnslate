// =========================================================================
// EarnSlate Smart SMS Parser Engine (100% Offline & Private)
// =========================================================================

package dev.qtremors.earnslate.data

import java.time.Instant
import java.time.ZoneId
import java.util.Locale
import java.util.UUID

object SmsParser {

    // -------------------------------------------------------------------------
    // 1. Non-Financial Filters (OTPs, Security Alerts, Spam)
    // -------------------------------------------------------------------------
    private val OTP_PATTERNS = listOf(
        Regex("""(?i)\b(?:otp|one\s*time\s*password|verification\s*code|security\s*code|login\s*code|secret\s*code|auth\s*code)\b"""),
        Regex("""(?i)\b(?:do\s*not\s*share|never\s*share|is\s*your\s*(?:otp|code|pin|secret))\b"""),
        Regex("""(?i)\b(?:valid\s*for|expires\s*in)\s*\d+\s*(?:mins?|minutes?|secs?|seconds?)\b"""),
        Regex("""(?i)\b(?:password\s*reset|to\s*login|login\s*attempt|verify\s*your\s*mobile|verify\s*your\s*account)\b""")
    )

    private val BALANCE_INQUIRY_ONLY = Regex(
        """(?i)^(?:dear\s+customer\s*,?\s*)?(?:avail(?:able)?\s+bal(?:ance)?|clear\s+bal|eff\s+bal|a/c\s+bal(?:ance)?)\s*(?:is|:)\s*(?:inr|rs|₹)""",
    )

    // -------------------------------------------------------------------------
    // 2. Transaction Type Patterns (Debit vs Credit)
    // -------------------------------------------------------------------------
    private val DEBIT_KEYWORDS = listOf(
        Regex("""(?i)\b(?:debited(?:\s+by|\s+with|\s+for|\s+from)?|debit\s+of|spent(?:\s+on|\s+at)?|paid(?:\s+to|\s+towards)?|withdrawn|sent\s+to|used\s+at|used\s+on|purchase\s+of|purchase\s+at|charged|transferred\s+to|transfer\s+to|deducted)\b"""),
        Regex("""(?i)\b(?:dr\b|payment\s+of|txn\s+of|vpa\b)""")
    )

    private val CREDIT_KEYWORDS = listOf(
        Regex("""(?i)\b(?:credited(?:\s+by|\s+with|\s+to|\s+into)?|credit\s+of|received(?:\s+from)?|deposited|salary|refunded|refund\s+of|added\s+to|cashback|cash\s+back|reversal\s+of|reversed\s+to)\b"""),
        Regex("""(?i)\b(?:cr\b|inflow)""")
    )

    // -------------------------------------------------------------------------
    // 3. Amount Extraction Regexes
    // -------------------------------------------------------------------------
    private val AMOUNT_PATTERNS = listOf(
        // e.g. Rs. 1,450.50, INR 500, ₹2,000, USD 45.00, $25, €30, £15
        Regex("""(?i)(?:rs\.?|inr|₹|\$|usd|eur|€|gbp|£)\s*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)"""),
        // e.g. 1450.50 INR, 500.00 Rs
        Regex("""(?i)([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)\s*(?:inr|rs\.?|usd|eur|gbp)"""),
        // e.g. debited for 450.00
        Regex("""(?i)(?:debited\s+(?:by|for|with|from)|credited\s+(?:by|for|with|to)|spent|paid|amount\s+of)\s*[:\s]*([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{1,2})?|[0-9]+(?:\.[0-9]{1,2})?)""")
    )

    // -------------------------------------------------------------------------
    // 4. Account, Card & UPI Extraction Patterns
    // -------------------------------------------------------------------------
    private val ACCOUNT_PATTERNS = listOf(
        Regex("""(?i)\b(?:a/c|acct|account|a/c\s*no\.?|ac\s*no\.?)\s*(?:ending|no\.?|num|#)?\s*[*xX]*(\d{3,4})\b"""),
        Regex("""(?i)\b(?:card|credit\s*card|debit\s*card)\s*(?:ending|no\.?|num|#|\(ending\))?\s*[*xX]*(\d{3,4})\b""")
    )

    private val UPI_REF_PATTERNS = listOf(
        Regex("""(?i)\b(?:upi\s*(?:ref|reference|txn)?(?:\s*(?:no\.?|id|num))?)\s*[:\s]*([a-zA-Z0-9]+)\b"""),
        Regex("""(?i)\b(?:rrn|ref\s*no\.?)\s*[:\s]*([a-zA-Z0-9]+)\b""")
    )

    // -------------------------------------------------------------------------
    // 5. Merchant Extraction Patterns
    // -------------------------------------------------------------------------
    private val MERCHANT_PATTERNS = listOf(
        Regex("""(?i)(?:purchase\s+at|spent\s+at|spent\s+on\s+[A-Za-z0-9\s-]+\s+at)\s+([A-Za-z0-9\s.&@'_-]+?)(?:\s+with|\s+using|\s+on|\s+dated|\s+ref|\.|\$|\n|$)"""),
        Regex("""(?i)(?:at|towards|paid\s+to|transferred\s+to|transfer\s+to|info:)\s+([A-Za-z0-9\s.&@'_-]+?)(?:\s+with|\s+using|\s+on|\s+dated|\s+ref|\s+avail|\s+bal|\s+upi|\s+thru|\s+through|\s+via|\.|\$|\n|$)"""),
        Regex("""(?i)\b(?:upi[/*:\s]+(?:dr[/*:\s]+|cr[/*:\s]+)?(?:[0-9]+[/*:\s]+)?)([A-Za-z0-9\s.&@_-]+?)(?:[/*\s.]|$)""")
    )

    // -------------------------------------------------------------------------
    // 6. 300+ Merchant Categorization Catalog
    // -------------------------------------------------------------------------
    private val CATEGORY_RULES = mapOf(
        "Food & Dining" to listOf(
            "swiggy", "zomato", "starbucks", "mcdonald", "kfc", "burger king", "domino", "subway",
            "zepto", "blinkit", "instamart", "bigbasket", "bb daily", "dunkin", "pizza hut", "taco bell",
            "dunzo", "haldiram", "chai point", "blue tokai", "third wave", "barbeque nation", "behrouz",
            "faasos", "eatclub", "freshmenu", "ovenstory", "wendy", "wow momo", "rebel foods",
            "tim hortons", "baskin robbins", "costa coffee", "cafe coffee day", "nature basket",
            "licious", "country delight", "box8", "biryani by kilo", "milk basket", "grofers",
            "grocery", "restaurant", "cafe", "bakery", "supermarket", "dining", "food", "kitchen",
            "sweet", "sweets", "bakes", "dhaba", "bhojanalya", "eats", "bar", "pub", "brewery",
            "doordash", "uber eats", "grubhub", "deliveroo", "instacart"
        ),
        "Transport" to listOf(
            "uber", "ola", "rapido", "metro", "shell", "indian oil", "hpcl", "bpcl", "irctc",
            "makemytrip", "redbus", "abhibus", "yulu", "blusmart", "zingbus", "goibibo", "cleartrip",
            "indigo", "air india", "vistara", "spicejet", "akasa", "fuel", "petrol", "diesel",
            "cng", "fastag", "toll", "parking", "cab", "auto", "railway", "train", "flight", "airlines",
            "airways", "lyft", "grab", "fuel pump", "petroleum", "service station", "autoworks"
        ),
        "Shopping" to listOf(
            "amazon", "flipkart", "myntra", "zara", "h&m", "hm", "d-mart", "dmart", "reliance retail",
            "reliance trends", "reliance digital", "nykaa", "ajio", "tata cliq", "meesho", "urbanic",
            "uniqlo", "marks & spencer", "westside", "pantaloons", "lifestyle", "shoppers stop",
            "croma", "vijay sales", "decathlon", "ikea", "nike", "adidas", "puma", "sephora",
            "lenskart", "tanishq", "caratlane", "kalyan", "titan", "apple store", "retail", "mall",
            "store", "mart", "bazaar", "boutique", "apparel", "clothing", "jewel", "jewellers",
            "footwear", "opticals", "walmart", "target", "costco", "best buy", "ebay", "etsy"
        ),
        "Entertainment" to listOf(
            "netflix", "spotify", "apple", "google play", "youtube", "hotstar", "disney",
            "sonyliv", "bookmyshow", "steam", "playstation", "xbox", "nintendo", "prime video",
            "zee5", "jiocinema", "pvr", "inox", "cinepolis", "cinema", "theatre", "movie",
            "gaming", "discord", "twitch", "audible", "kindle", "hulu", "paramount", "peacock",
            "epic games", "crunchyroll", "tidal", "deezer", "soundcloud", "gaana", "wynk"
        ),
        "Utilities" to listOf(
            "electricity", "bescom", "adani", "airtel", "jio", "vi", "vodafone", "tata sky",
            "tata play", "hathway", "act fibernet", "water", "gas", "igl", "mgl", "mahanagar gas",
            "torrent power", "discom", "broadband", "wifi", "recharge", "postpaid", "prepaid",
            "dth", "utility", "bill payment", "municipal", "cesc", "tneb", "mseb", "uppcl",
            "bsnl", "mtnl", "pipeline", "sewage", "clean water", "power corp"
        ),
        "Health" to listOf(
            "apollo", "netmeds", "1mg", "tata 1mg", "practo", "hospital", "pharmacy", "medplus",
            "pharmeasy", "dr lal pathlabs", "srl diagnostics", "metropolis", "max healthcare",
            "fortis", "manipal", "cult.fit", "gym", "fitness", "dental", "clinic", "doctor",
            "medical", "medicine", "health", "care", "wellness", "therapist", "optometry",
            "diagnostic", "pathology", "cvs", "walgreens", "boots"
        ),
        "Subscriptions" to listOf(
            "subscription", "recurring", "auto-debit", "standing instruction", "mandate",
            "si txn", "e-mandate", "si on card", "nach", "ecs mandate"
        ),
        "Income" to listOf(
            "salary", "retainer", "payout", "dividend", "interest credited", "stipend",
            "allowance", "bonus", "commission", "employer", "payroll", "freelance",
            "rent received", "cashback credited"
        )
    )

    // -------------------------------------------------------------------------
    // 7. Known Sender Entities Catalog
    // -------------------------------------------------------------------------
    private val SENDER_ENTITIES = mapOf(
        "HDFCBN" to "HDFC Bank",
        "HDFCBK" to "HDFC Bank",
        "HDFCB" to "HDFC Bank",
        "HDFC" to "HDFC Bank",
        "ICICIB" to "ICICI Bank",
        "ICICI" to "ICICI Bank",
        "SBINB" to "SBI",
        "SBIPSG" to "SBI",
        "SBIINB" to "SBI",
        "SBIUPI" to "SBI",
        "SBISMS" to "SBI",
        "SBI" to "SBI",
        "AXISBK" to "Axis Bank",
        "AXIS" to "Axis Bank",
        "KOTAKB" to "Kotak Bank",
        "KOTAK" to "Kotak Bank",
        "PNBSMS" to "PNB",
        "PNB" to "PNB",
        "BOISMS" to "Bank of India",
        "BOI" to "Bank of India",
        "CANBNK" to "Canara Bank",
        "CANARA" to "Canara Bank",
        "UNIONB" to "Union Bank",
        "UBI" to "Union Bank",
        "YESBNK" to "Yes Bank",
        "YES" to "Yes Bank",
        "IDFCFB" to "IDFC First Bank",
        "IDFC" to "IDFC First Bank",
        "INDUSB" to "IndusInd Bank",
        "INDUS" to "IndusInd Bank",
        "FEDBNK" to "Federal Bank",
        "RBLBNK" to "RBL Bank",
        "AUBLTD" to "AU Small Finance Bank",
        "PAYTM" to "Paytm",
        "PYTM" to "Paytm",
        "AIRTEL" to "Airtel Payments Bank",
        "ATMBK" to "Airtel Payments Bank",
        "JIOBNK" to "Jio Payments Bank",
        "SWIGGY" to "Swiggy",
        "ZOMATO" to "Zomato",
        "ZEPTO" to "Zepto",
        "BLINKT" to "Blinkit",
        "AMAZON" to "Amazon",
        "AMZN" to "Amazon",
        "FLPKRT" to "Flipkart",
        "UBERIN" to "Uber",
        "UBER" to "Uber",
        "OLACAB" to "Ola",
        "OLA" to "Ola",
        "CREDIN" to "CRED",
        "CRED" to "CRED",
        "MYNTRA" to "Myntra",
        "BIGBSK" to "BigBasket",
        "DUNZO" to "Dunzo",
        "IRCTCI" to "IRCTC",
        "MMTRIP" to "MakeMyTrip"
    )

    // -------------------------------------------------------------------------
    // 8. Main Parsing Entry Point
    // -------------------------------------------------------------------------
    fun parse(
        sender: String,
        body: String,
        timestampMillis: Long = System.currentTimeMillis()
    ): ParsedSmsTransaction? {
        val trimmed = body.trim()
        if (trimmed.isEmpty()) return null

        // Filter out OTPs, password resets, and pure balance inquiries
        if (isOtpOrSecurityMessage(trimmed)) return null
        if (BALANCE_INQUIRY_ONLY.containsMatchIn(trimmed) && !containsDebitOrCredit(trimmed)) return null

        // Determine transaction type (Debit vs Credit)
        val type = determineTransactionType(trimmed) ?: return null

        // Extract amount
        val amount = extractAmount(trimmed) ?: return null
        if (amount <= 0.0) return null

        // Extract account or card info
        val accountOrCard = extractAccountOrCard(trimmed)

        // Extract merchant / payee name
        val merchant = extractMerchant(trimmed, sender)

        // Classify category based on merchant name and SMS body
        val category = classifyCategory(merchant ?: trimmed, type)

        // Extract date
        val date = extractDate(trimmed, timestampMillis)

        // Extract reference ID
        val referenceId = extractReferenceId(trimmed)

        return ParsedSmsTransaction(
            id = UUID.randomUUID().toString(),
            rawBody = trimmed,
            sender = sender.trim(),
            amount = amount,
            type = type,
            date = date,
            accountOrCard = accountOrCard,
            merchant = merchant,
            suggestedCategory = category,
            referenceId = referenceId,
            confidence = if (merchant != null && accountOrCard != null) 1.0f else 0.85f
        )
    }

    // -------------------------------------------------------------------------
    // 9. Helper Methods
    // -------------------------------------------------------------------------
    private fun isOtpOrSecurityMessage(text: String): Boolean {
        for (pattern in OTP_PATTERNS) {
            if (pattern.containsMatchIn(text)) {
                return true
            }
        }
        return false
    }

    private fun containsDebitOrCredit(text: String): Boolean {
        val sanitized = sanitizeTextForCreditCheck(text)
        return DEBIT_KEYWORDS.any { it.containsMatchIn(text) } ||
            CREDIT_KEYWORDS.any { it.containsMatchIn(sanitized) }
    }

    /**
     * Sanitizes text to remove non-transactional uses of "credit", such as
     * "credit card", "credit limit", "available credit", or "UPI/CR/..." reference IDs.
     */
    private fun sanitizeTextForCreditCheck(text: String): String {
        return text
            .replace(Regex("""(?i)\bcredit\s*card\b"""), "card")
            .replace(Regex("""(?i)\bcredit\s*limit\b"""), "limit")
            .replace(Regex("""(?i)\bavailable\s*credit\b"""), "limit")
            .replace(Regex("""(?i)\bavail\s*credit\b"""), "limit")
            .replace(Regex("""(?i)\bline\s*of\s*credit\b"""), "line")
            .replace(Regex("""(?i)\bupi/cr/\w+"""), "upi/ref")
            .replace(Regex("""(?i)/cr/"""), "/ref/")
    }

    private fun determineTransactionType(text: String): TransactionType? {
        val sanitized = sanitizeTextForCreditCheck(text)

        val hasDebit = DEBIT_KEYWORDS.any { it.containsMatchIn(text) }
        val hasCredit = CREDIT_KEYWORDS.any { it.containsMatchIn(sanitized) }

        return when {
            hasDebit && !hasCredit -> TransactionType.expense
            hasCredit && !hasDebit -> TransactionType.income
            hasDebit && hasCredit -> {
                // If debit action words exist (debited, spent, paid, purchase, etc.), prioritize expense
                val strongDebitRegex = Regex("""(?i)\b(?:debited|spent|paid|purchase|charged|withdrawn|sent\s+to|used\s+at)\b""")
                val strongCreditRegex = Regex("""(?i)\b(?:credited|received|salary|deposited|refund|cashback|reversal)\b""")

                val hasStrongDebit = strongDebitRegex.containsMatchIn(text)
                val hasStrongCredit = strongCreditRegex.containsMatchIn(sanitized)

                when {
                    hasStrongDebit && !hasStrongCredit -> TransactionType.expense
                    hasStrongCredit && !hasStrongDebit -> TransactionType.income
                    else -> {
                        val debitIdx = DEBIT_KEYWORDS.mapNotNull { it.find(text)?.range?.first }.minOrNull() ?: Int.MAX_VALUE
                        val creditIdx = CREDIT_KEYWORDS.mapNotNull { it.find(sanitized)?.range?.first }.minOrNull() ?: Int.MAX_VALUE
                        if (debitIdx < creditIdx) TransactionType.expense else TransactionType.income
                    }
                }
            }
            else -> null
        }
    }

    private fun extractAmount(text: String): Double? {
        for (pattern in AMOUNT_PATTERNS) {
            val match = pattern.find(text) ?: continue
            val numStr = match.groupValues.getOrNull(1)?.replace(",", "")?.trim() ?: continue
            val parsed = numStr.toDoubleOrNull()
            if (parsed != null && parsed > 0.0) return parsed
        }
        return null
    }

    private fun extractAccountOrCard(text: String): String? {
        for (pattern in ACCOUNT_PATTERNS) {
            val match = pattern.find(text) ?: continue
            val digits = match.groupValues.getOrNull(1) ?: continue
            val isCard = text.contains("card", ignoreCase = true)
            return if (isCard) "Card ending $digits" else "A/c ending $digits"
        }
        return null
    }

    fun normalizeSender(sender: String): String {
        val clean = sender.trim()
        if (clean.isEmpty()) return "Bank Alert"

        // If sender is formatted with hyphens e.g. "VD-HDFCBN-P", "CP-ZOMATO-S", "AD-SBINB"
        if (clean.contains("-")) {
            val parts = clean.split("-").map { it.trim() }.filter { it.isNotEmpty() }
            val candidate = if (parts.size >= 2) {
                // If parts[0] is 2 letters (telecom header like VD, VM, CP, AD, BZ, VK)
                if (parts[0].length == 2 && parts[1].length >= 3) parts[1]
                else parts.maxByOrNull { it.length } ?: parts.first()
            } else parts.first()

            return mapEntityCode(candidate)
        }

        // If sender starts with 2 letters of telecom prefix e.g. "VDHDFCBN"
        if (clean.length in 6..9 && clean.all { it.isLetter() }) {
            val withoutPrefix = clean.drop(2)
            val mapped = mapEntityCode(withoutPrefix)
            if (mapped != withoutPrefix) return mapped
        }

        return mapEntityCode(clean)
    }

    private fun mapEntityCode(code: String): String {
        val upper = code.uppercase().filter { it.isLetterOrDigit() }
        if (upper.isEmpty()) return "Bank Alert"

        // Direct exact match
        SENDER_ENTITIES[upper]?.let { return it }

        // Substring / known prefix matches
        for ((k, v) in SENDER_ENTITIES) {
            if (upper.startsWith(k) || upper.contains(k) || k.startsWith(upper)) {
                return v
            }
        }

        // TitleCase fallback
        return upper.lowercase().replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
    }

    private fun extractMerchant(text: String, sender: String): String? {
        // 1. Direct search for prominent known brand names in body
        for ((_, keywords) in CATEGORY_RULES) {
            for (kw in keywords) {
                if (kw.length >= 4 && Regex("""(?i)\b${Regex.escape(kw)}\b""").containsMatchIn(text)) {
                    return kw.split(" ")
                        .joinToString(" ") { it.replaceFirstChar { c -> c.titlecase(Locale.getDefault()) } }
                }
            }
        }

        // 2. Pattern-based extraction from body
        for (pattern in MERCHANT_PATTERNS) {
            val match = pattern.find(text) ?: continue
            val rawMerchant = match.groupValues.getOrNull(1)?.trim() ?: continue
            val cleaned = cleanMerchantName(rawMerchant)
            if (cleaned.length in 2..40) return cleaned
        }

        // 3. Fallback: Normalized sender name (e.g. HDFC Bank, Zomato, SBI)
        return normalizeSender(sender)
    }

    private fun cleanMerchantName(raw: String): String {
        var result = raw
        // Remove trailing punctuation, whitespace, or transaction filler words
        val noiseWords = listOf(
            "with", "using", "card ending", "card", "ending", "a/c", "account",
            "on", "dated", "ref", "ref no", "bal", "balance", "avail", "available",
            "upi", "thru", "through", "via", "info", "towards", "txn", "val"
        )
        for (noise in noiseWords) {
            val regex = Regex("""(?i)\s+\b$noise\b.*$""")
            result = result.replace(regex, "")
        }
        return result.replace(Regex("""[^\w\s.&'-]"""), "").trim().split(" ")
            .filter { it.isNotBlank() }
            .joinToString(" ") { word ->
                word.lowercase().replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() }
            }
    }

    private fun extractReferenceId(text: String): String? {
        for (pattern in UPI_REF_PATTERNS) {
            val match = pattern.find(text) ?: continue
            val ref = match.groupValues.getOrNull(1)?.trim() ?: continue
            if (ref.length in 4..30) return ref
        }
        return null
    }

    private fun extractDate(text: String, timestampMillis: Long): String {
        return Instant.ofEpochMilli(timestampMillis)
            .atZone(ZoneId.systemDefault())
            .toLocalDate()
            .toString()
    }

    fun classifyCategory(merchantOrBody: String, type: TransactionType): String {
        val lower = merchantOrBody.lowercase()

        if (type == TransactionType.income) {
            return "Income"
        }

        for ((category, keywords) in CATEGORY_RULES) {
            if (category == "Income") continue
            for (kw in keywords) {
                if (Regex("""\b${Regex.escape(kw)}\b""").containsMatchIn(lower) || (kw.length >= 4 && lower.contains(kw))) {
                    return category
                }
            }
        }

        return "Other"
    }
}
