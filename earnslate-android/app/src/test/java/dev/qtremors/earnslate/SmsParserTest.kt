// =========================================================================
// EarnSlate SMS Parser Test Suite
// =========================================================================

package dev.qtremors.earnslate

import dev.qtremors.earnslate.data.SmsParser
import dev.qtremors.earnslate.data.TransactionType
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class SmsParserTest {

    // -------------------------------------------------------------------------
    // 1. OTP & Security Message Filtering
    // -------------------------------------------------------------------------
    @Test
    fun otpAndSecurityMessagesAreSafelyFilteredOut() {
        val otpSamples = listOf(
            "123456 is your OTP for transaction of INR 500.00 at Swiggy. Do not share this code with anyone.",
            "Dear Customer, your One Time Password for login is 987654. Valid for 5 minutes. Never share your OTP.",
            "Use verification code 432109 to authenticate your account. Do not disclose to bank officials.",
            "Your password reset request for netbanking has been received. Code: 778899.",
            "Dear customer, 554433 is your secret PIN to authorize withdrawal of Rs 2000. Do not share."
        )

        for (sms in otpSamples) {
            val parsed = SmsParser.parse("HDFCBK", sms)
            assertNull("Expected OTP to be ignored: $sms", parsed)
        }
    }

    @Test
    fun balanceInquiryWithoutTransactionIsIgnored() {
        val balanceSms = "Dear Customer, Avail Bal in A/c ending 1234 is INR 45,230.50 on 18-AUG-26. Call 1800123 for queries."
        val parsed = SmsParser.parse("SBIBNK", balanceSms)
        assertNull("Balance inquiry should not produce transaction", parsed)
    }

    // -------------------------------------------------------------------------
    // 2. Indian Bank Test Vectors (HDFC, SBI, ICICI, Axis, Kotak, UPI)
    // -------------------------------------------------------------------------
    @Test
    fun parseHdfcDebitSms() {
        val sms = "Rs 450.00 debited from A/c **4321 on 18-AUG-26 to SWIGGY. UPI Ref 324156789. Avail Bal Rs 12,300.00."
        val parsed = SmsParser.parse("HDFCBK", sms)
        assertNotNull(parsed)
        assertEquals(450.00, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Food & Dining", parsed.suggestedCategory)
        assertTrue(parsed.accountOrCard?.contains("4321") == true)
    }

    @Test
    fun parseHdfcCreditSms() {
        val sms = "INR 85,000.00 credited to A/c ending 4321 on 01-AUG-26 towards Salary for July. Avail Bal INR 1,20,500.00."
        val parsed = SmsParser.parse("HDFCBK", sms)
        assertNotNull(parsed)
        assertEquals(85000.00, parsed!!.amount, 0.001)
        assertEquals(TransactionType.income, parsed.type)
        assertEquals("Income", parsed.suggestedCategory)
    }

    @Test
    fun parseSbiUpiDebitSms() {
        val sms = "Dear UPI user A/C 9876 debited by 320.0 on 18Aug26 transfer to Uber India via UPI. Ref No 654321."
        val parsed = SmsParser.parse("SBIUPI", sms)
        assertNotNull(parsed)
        assertEquals(320.0, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Transport", parsed.suggestedCategory)
    }

    @Test
    fun parseIciciCreditCardSms() {
        val sms = "Alert: You have spent INR 2,499.00 on ICICI Bank Credit Card ending 8890 at AMAZON INDIA on 17-Aug-26."
        val parsed = SmsParser.parse("ICICIB", sms)
        assertNotNull(parsed)
        assertEquals(2499.00, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Shopping", parsed.suggestedCategory)
        assertTrue(parsed.accountOrCard?.contains("8890") == true)
    }

    @Test
    fun parseAxisBankSubscriptionDebitSms() {
        val sms = "Your A/c 5678 is debited for INR 649.00 on 15-Aug-26 towards NETFLIX recurring subscription. Bal: INR 14,200."
        val parsed = SmsParser.parse("AXISBK", sms)
        assertNotNull(parsed)
        assertEquals(649.00, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Entertainment", parsed.suggestedCategory)
    }

    @Test
    fun parseKotakUtilityPaymentSms() {
        val sms = "Paid Rs. 1,450.50 from Kotak Bank A/c 1122 to BESCOM on 10-Aug-26. UPI Ref 99887766."
        val parsed = SmsParser.parse("KOTAKB", sms)
        assertNotNull(parsed)
        assertEquals(1450.50, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Utilities", parsed.suggestedCategory)
    }

    @Test
    fun parseApolloPharmacyHealthExpense() {
        val sms = "Rs 890 spent on Card ending 3344 at APOLLO PHARMACY on 14-Aug-26. Avail Limit: Rs 45,000."
        val parsed = SmsParser.parse("RBLBNK", sms)
        assertNotNull(parsed)
        assertEquals(890.0, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Health", parsed.suggestedCategory)
    }

    // -------------------------------------------------------------------------
    // 3. International & Global Currency Vectors (USD, EUR, GBP)
    // -------------------------------------------------------------------------
    @Test
    fun parseUsdChaseDebitSms() {
        val sms = "Chase Alert: You paid $45.50 to Starbucks on 18-Aug-2026 with debit card ending 2040."
        val parsed = SmsParser.parse("CHASE", sms)
        assertNotNull(parsed)
        assertEquals(45.50, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Food & Dining", parsed.suggestedCategory)
    }

    @Test
    fun parseEurRevolutExpense() {
        val sms = "You spent €29.99 at Spotify with your Revolut card ending in 9012."
        val parsed = SmsParser.parse("REVOLUT", sms)
        assertNotNull(parsed)
        assertEquals(29.99, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Entertainment", parsed.suggestedCategory)
    }

    @Test
    fun parseGbpBarclaysExpense() {
        val sms = "Barclays: Paid £12.50 to Uber on card ending 5511 on 18/08/2026."
        val parsed = SmsParser.parse("BARCLAYS", sms)
        assertNotNull(parsed)
        assertEquals(12.50, parsed!!.amount, 0.001)
        assertEquals(TransactionType.expense, parsed.type)
        assertEquals("Transport", parsed.suggestedCategory)
    }

    // -------------------------------------------------------------------------
    // 5. Telecom TRAI Header Normalization & Real-World User Scenarios
    // -------------------------------------------------------------------------
    @Test
    fun parseTelecomPrefixedSendersCorrectly() {
        // Zomato SMS with CP-ZOMATO-S header
        val zomatoSms = "Your payment of Rs 232.34 for Zomato order is successful on 16-Aug-2026. Ref: 442211."
        val zomatoParsed = SmsParser.parse("CP-ZOMATO-S", zomatoSms)
        assertNotNull(zomatoParsed)
        assertEquals("Zomato", zomatoParsed!!.merchant)
        assertEquals(232.34, zomatoParsed.amount, 0.001)
        assertEquals(TransactionType.expense, zomatoParsed.type)
        assertEquals("Food & Dining", zomatoParsed.suggestedCategory)

        // HDFC SMS with VD-HDFCBN-P header and UPI payee
        val hdfcUpiSms = "Rs 275.00 debited from A/c ending 4440 on 17-AUG-26. Info: UPI/CR/123456/Starbucks. Avail Bal: Rs 15,200.00."
        val hdfcUpiParsed = SmsParser.parse("VD-HDFCBN-P", hdfcUpiSms)
        assertNotNull(hdfcUpiParsed)
        assertEquals("Starbucks", hdfcUpiParsed!!.merchant)
        assertEquals(275.00, hdfcUpiParsed.amount, 0.001)
        assertEquals(TransactionType.expense, hdfcUpiParsed.type)
        assertEquals("Food & Dining", hdfcUpiParsed.suggestedCategory)

        // HDFC SMS with VD-HDFCBN-P header fallback
        val hdfcBankSms = "Rs 275.00 debited from A/c ending 4440 on 17-AUG-26. Avail Bal: Rs 15,200.00."
        val hdfcBankParsed = SmsParser.parse("VD-HDFCBN-P", hdfcBankSms)
        assertNotNull(hdfcBankParsed)
        assertEquals("HDFC Bank", hdfcBankParsed!!.merchant)
        assertEquals(275.00, hdfcBankParsed.amount, 0.001)
        assertEquals(TransactionType.expense, hdfcBankParsed.type)

        // HDFC Credit Card SMS with VD-HDFCBK-S header
        val hdfcCardSms = "Rs.232.34 spent on HDFC Bank Credit Card ending 4440 at Zomato on 16-AUG-26. Avail limit: Rs.45,000.00."
        val hdfcCardParsed = SmsParser.parse("VD-HDFCBK-S", hdfcCardSms)
        assertNotNull(hdfcCardParsed)
        assertEquals("Zomato", hdfcCardParsed!!.merchant)
        assertEquals(232.34, hdfcCardParsed.amount, 0.001)
        assertEquals(TransactionType.expense, hdfcCardParsed.type)
        assertEquals("Food & Dining", hdfcCardParsed.suggestedCategory)
        assertTrue(hdfcCardParsed.accountOrCard?.contains("4440") == true)
    }
}
