package com.agropulse.service;

import com.agropulse.model.GovernmentScheme;
import com.agropulse.repository.GovernmentSchemeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class SchemeSyncService {

    private static final Logger log = LoggerFactory.getLogger(SchemeSyncService.class);

    private final GovernmentSchemeRepository schemeRepository;

    public SchemeSyncService(GovernmentSchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    // Run on startup and every 24 hours at 2 AM
    @Scheduled(initialDelay = 5000, fixedRate = 86_400_000)
    @Transactional
    public int syncSchemes() {
        log.info("Starting government scheme sync...");
        List<GovernmentScheme> catalogue = buildCatalogue();
        int added = 0;
        for (GovernmentScheme scheme : catalogue) {
            if (!schemeRepository.existsBySchemeNameIgnoreCase(scheme.getSchemeName())) {
                schemeRepository.save(scheme);
                added++;
            }
        }
        log.info("Scheme sync complete — {} new schemes added.", added);
        return added;
    }

    private List<GovernmentScheme> buildCatalogue() {
        List<GovernmentScheme> list = new ArrayList<>();

        // ── PM-Level / All India ──────────────────────────────────────────
        list.add(scheme(
            "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            "PM-KISAN",
            "Direct income support of ₹6,000 per year to eligible farmer families across India.",
            "Small and marginal farmer families with combined land holding up to 2 hectares as per state records.",
            "₹6,000 per year in three equal installments of ₹2,000 directly transferred to bank accounts.",
            "Register online at pmkisan.gov.in or visit nearest Common Service Centre (CSC) with Aadhaar and land records.",
            "https://pmkisan.gov.in/",
            LocalDate.now().plusMonths(6),
            "All India",
            "https://pmkisan.gov.in/",
            LocalDate.now().minusDays(10)
        ));

        list.add(scheme(
            "Kisan Credit Card (KCC) Scheme",
            "Crop Loan",
            "Provides farmers timely and flexible credit for crop production, post-harvest expenses, and allied activities.",
            "Farmers, sharecroppers, oral lessees, and tenant farmers engaged in agriculture, fisheries, or animal husbandry.",
            "Revolving credit limit with interest subvention of 2% + 3% prompt repayment incentive. Effective rate ~4% p.a.",
            "Apply at any nationalized bank, cooperative bank, or Regional Rural Bank branch with land records and ID proof.",
            "https://www.nabard.org/",
            null,
            "All India",
            "https://www.nabard.org/",
            LocalDate.now().minusDays(5)
        ));

        list.add(scheme(
            "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            "Crop Insurance",
            "Comprehensive crop insurance providing financial support to farmers against crop loss due to natural calamities, pests, and diseases.",
            "All farmers growing notified crops in notified areas, including sharecroppers and tenant farmers.",
            "Premium as low as 2% for Kharif, 1.5% for Rabi, and 5% for commercial crops. Full sum insured payout on crop failure.",
            "Enroll through nearest bank branch, insurance company office, or pmfby.gov.in portal before cut-off date.",
            "https://pmfby.gov.in/",
            LocalDate.now().plusMonths(2),
            "All India",
            "https://pmfby.gov.in/",
            LocalDate.now().minusDays(3)
        ));

        list.add(scheme(
            "Soil Health Card Scheme",
            "Fertilizer Subsidy",
            "Promotes balanced and optimized use of fertilizers based on individual soil nutrient analysis.",
            "All farmers owning or cultivating agricultural land in India.",
            "Free soil testing every 2 years and customized fertilizer recommendation card to improve yield and reduce input cost.",
            "Contact local agriculture department office or soil testing laboratory for sample collection.",
            "https://soilhealth.dac.gov.in/",
            null,
            "All India",
            "https://soilhealth.dac.gov.in/",
            LocalDate.now().minusDays(20)
        ));

        list.add(scheme(
            "PM Krishi Sinchai Yojana (PMKSY)",
            "Irrigation",
            "Har Khet Ko Paani — expands irrigation coverage and improves water-use efficiency through micro-irrigation.",
            "All farmers with agricultural land, priority to small and marginal farmers.",
            "Subsidy up to 55% for small/marginal farmers and 45% for others on drip and sprinkler irrigation systems.",
            "Apply through state agriculture or horticulture department. Visit pmksy.gov.in for state-wise contacts.",
            "https://pmksy.gov.in/",
            null,
            "All India",
            "https://pmksy.gov.in/",
            LocalDate.now().minusDays(15)
        ));

        list.add(scheme(
            "National Food Security Mission (NFSM)",
            "General",
            "Increases production of rice, wheat, pulses, coarse cereals, and commercial crops through area expansion and productivity enhancement.",
            "Farmers in identified low-productivity districts for targeted crops.",
            "Subsidized seeds, fertilizers, crop demonstrations, and farm machinery at district level.",
            "Contact district agriculture officer or Block Agriculture Office for registration.",
            "https://nfsm.gov.in/",
            null,
            "All India",
            "https://nfsm.gov.in/",
            LocalDate.now().minusDays(25)
        ));

        list.add(scheme(
            "Rashtriya Krishi Vikas Yojana (RKVY)",
            "General",
            "Incentivizes states to increase public investment in agriculture and allied sectors to achieve 4% annual growth.",
            "State governments who in turn benefit individual farmers through state-level sub-schemes.",
            "Flexible funding for infrastructure, new technologies, agri-business, and farmer training.",
            "Apply through state agriculture department for state-specific RKVY sub-schemes.",
            "https://rkvy.nic.in/",
            null,
            "All India",
            "https://rkvy.nic.in/",
            LocalDate.now().minusDays(30)
        ));

        list.add(scheme(
            "Sub Mission on Agricultural Mechanization (SMAM)",
            "Farm Machinery",
            "Promotes farm mechanization to reduce drudgery, lower cost of cultivation, and improve productivity.",
            "Individual farmers, FPOs, cooperatives, and custom hiring centres.",
            "Subsidy of 40–50% on tractors and farm machinery for general farmers; 50–80% for SC/ST and small farmers.",
            "Apply at district agriculture office or state agriculture department portal.",
            "https://farmech.dac.gov.in/",
            null,
            "All India",
            "https://farmech.dac.gov.in/",
            LocalDate.now().minusDays(8)
        ));

        list.add(scheme(
            "Paramparagat Krishi Vikas Yojana (PKVY)",
            "Organic Farming",
            "Promotes organic farming through cluster approach to increase soil health, reduce input costs, and certify organic produce.",
            "Farmers willing to adopt organic farming practices and form clusters of at least 50 acres.",
            "₹50,000 per hectare over 3 years for organic inputs, certification, and marketing support.",
            "Contact state agriculture department or Participatory Guarantee System (PGS) regional council.",
            "https://pgsindia-ncof.gov.in/",
            null,
            "All India",
            "https://pgsindia-ncof.gov.in/",
            LocalDate.now().minusDays(2)
        ));

        list.add(scheme(
            "National Horticulture Mission (NHM)",
            "Horticulture",
            "Holistic development of horticulture sector including fruits, vegetables, spices, flowers, and mushrooms.",
            "Individual farmers, SHGs, FPOs, cooperatives in identified states.",
            "Subsidy on planting material, protected cultivation, post-harvest infrastructure, and market linkage.",
            "Apply through state horticulture department or district horticulture officer.",
            "https://nhm.nic.in/",
            null,
            "All India",
            "https://nhm.nic.in/",
            LocalDate.now().minusDays(18)
        ));

        list.add(scheme(
            "PM-KUSUM (Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
            "Irrigation",
            "Provides energy security to farmers by installing solar pumps and grid-connected solar power plants.",
            "Individual farmers, FPOs, cooperatives, and panchayats with irrigated land.",
            "60% central/state subsidy on solar pump installation. Farmer pays only 10%; 30% is bank loan.",
            "Apply through state DISCOM (electricity distribution company) or state agriculture department.",
            "https://mnre.gov.in/",
            null,
            "All India",
            "https://mnre.gov.in/",
            LocalDate.now().minusDays(12)
        ));

        list.add(scheme(
            "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
            "General",
            "Pension scheme providing ₹3,000 per month to small and marginal farmers on reaching age 60.",
            "Small and marginal farmers aged 18-40 years with land holding up to 2 hectares.",
            "Monthly pension of ₹3,000 after age 60. Contribution ranges from ₹55 to ₹200/month matched by government.",
            "Enroll at nearest CSC with Aadhaar, bank passbook, and land records.",
            "https://maandhan.in/",
            null,
            "All India",
            "https://maandhan.in/",
            LocalDate.now().minusDays(22)
        ));

        list.add(scheme(
            "Agriculture Infrastructure Fund (AIF)",
            "General",
            "Medium-long term financing facility for post-harvest management infrastructure and community farming assets.",
            "Farmers, FPOs, PACS, cooperatives, SHGs, agri-entrepreneurs, and start-ups.",
            "Loans up to ₹2 crore with 3% interest subvention per annum and 2 year moratorium.",
            "Apply through participating financial institutions on agriinfra.dac.gov.in portal.",
            "https://agriinfra.dac.gov.in/",
            LocalDate.now().plusMonths(12),
            "All India",
            "https://agriinfra.dac.gov.in/",
            LocalDate.now().minusDays(7)
        ));

        list.add(scheme(
            "National Livestock Mission (NLM)",
            "Livestock",
            "Sustainable development of livestock sector focusing on feed and fodder, breed improvement, and risk management.",
            "Individual farmers, entrepreneurs, FPOs, cooperatives, SHGs involved in livestock rearing.",
            "Subsidy up to 50% on entrepreneur development for poultry, sheep, goat, piggery, and fodder production.",
            "Apply through district animal husbandry office or state livestock development board.",
            "https://nlm.udyamimitra.in/",
            null,
            "All India",
            "https://nlm.udyamimitra.in/",
            LocalDate.now().minusDays(14)
        ));

        list.add(scheme(
            "Pradhan Mantri Matsya Sampada Yojana (PMMSY)",
            "Livestock",
            "Transforms fisheries sector for enhanced fish production, productivity, quality, and modern infrastructure.",
            "Fishers, fish farmers, SHGs, FPOs, cooperatives, and fish vendors.",
            "Subsidy of 40-60% on fishing vessels, aquaculture units, cold chain, and marketing infrastructure.",
            "Apply through state fisheries department with project proposal and identity documents.",
            "https://pmmsy.dof.gov.in/",
            null,
            "All India",
            "https://pmmsy.dof.gov.in/",
            LocalDate.now().minusDays(9)
        ));

        // ── State-Specific Schemes ────────────────────────────────────────
        list.add(scheme(
            "UP Kisan Karj Rahat Yojana",
            "Crop Loan",
            "Uttar Pradesh government scheme providing relief on outstanding crop loans for eligible farmers.",
            "Small and marginal farmers with outstanding crop loans taken from cooperative banks in Uttar Pradesh.",
            "One-time waiver of crop loan up to ₹1 lakh for eligible farmer families.",
            "Submit application through district cooperative bank or UP agriculture department with loan and land documents.",
            "https://upkisankarjrahat.upsdc.gov.in/",
            LocalDate.now().plusMonths(3),
            "Uttar Pradesh",
            "https://upkisankarjrahat.upsdc.gov.in/",
            LocalDate.now().minusDays(6)
        ));

        list.add(scheme(
            "Haryana Meri Fasal Mera Byora",
            "General",
            "Haryana state portal for crop registration enabling farmers to sell produce at MSP and access government schemes.",
            "All farmers in Haryana with agricultural land.",
            "Access to MSP procurement, PM-KISAN, Fasal Bima and other state scheme benefits through single registration.",
            "Register on fasal.haryana.gov.in with Aadhaar and land records before crop sowing.",
            "https://fasal.haryana.gov.in/",
            LocalDate.now().plusMonths(1),
            "Haryana",
            "https://fasal.haryana.gov.in/",
            LocalDate.now().minusDays(4)
        ));

        list.add(scheme(
            "Maharashtra Gopinath Munde Shetkari Apghat Suraksha Sangraha Yojana",
            "General",
            "Accidental insurance scheme for farmers providing financial support to family on accidental death or disability.",
            "All farmers registered in Maharashtra between 10 to 75 years of age.",
            "₹2 lakh on accidental death, ₹1 lakh on partial disability, coverage for road/rail accidents and natural calamities.",
            "Apply through taluka agriculture office within 90 days of accident with FIR and medical documents.",
            "https://krishi.maharashtra.gov.in/",
            null,
            "Maharashtra",
            "https://krishi.maharashtra.gov.in/",
            LocalDate.now().minusDays(11)
        ));

        list.add(scheme(
            "Punjab Khet Paani Yojana",
            "Irrigation",
            "Punjab government scheme for drip and sprinkler irrigation to conserve groundwater and improve water efficiency.",
            "Farmers in Punjab with agricultural land, priority to paddy growing farmers.",
            "Subsidy up to 80% for SC farmers and 70% for general farmers on micro-irrigation equipment.",
            "Apply through district horticulture/agriculture office or Punjab Agri portal.",
            "https://agripb.gov.in/",
            LocalDate.now().plusMonths(4),
            "Punjab",
            "https://agripb.gov.in/",
            LocalDate.now().minusDays(16)
        ));

        list.add(scheme(
            "Rajasthan Mukhyamantri Krishi Udyog Yojana",
            "Farm Machinery",
            "Promotes agro-processing and value addition enterprises to increase farmer income in Rajasthan.",
            "Individual farmers, FPOs, cooperatives, and entrepreneurs setting up agro-processing units in Rajasthan.",
            "Capital subsidy up to 25% on agro-processing machinery and equipment with maximum ₹25 lakh.",
            "Apply through RIICO or district industries centre with DPR and land documents.",
            "https://rajkisan.rajasthan.gov.in/",
            LocalDate.now().plusMonths(8),
            "Rajasthan",
            "https://rajkisan.rajasthan.gov.in/",
            LocalDate.now().minusDays(19)
        ));

        list.add(scheme(
            "Karnataka Raitha Shakti Scheme",
            "Farm Machinery",
            "Karnataka scheme providing farm machinery at subsidized rates to help small farmers reduce manual labour.",
            "Small and marginal farmers in Karnataka with agricultural land up to 2 hectares.",
            "Subsidy of 50-90% on tractors, power tillers, threshers, and other farm implements.",
            "Apply at nearest agriculture officer or raitha seva kendra with land and income documents.",
            "https://raitamitra.karnataka.gov.in/",
            null,
            "Karnataka",
            "https://raitamitra.karnataka.gov.in/",
            LocalDate.now().minusDays(23)
        ));

        list.add(scheme(
            "Gujarat Kisan Suryoday Yojana",
            "Irrigation",
            "Gujarat government scheme providing daytime electricity supply to farmers for irrigation pumps.",
            "All farmer consumers with agricultural connections in Gujarat.",
            "Reliable 3-phase electricity supply from 5 AM to 9 PM for irrigation reducing diesel pump costs.",
            "Register through Gujarat Energy Development Agency (GEDA) or local electricity board office.",
            "https://gujaratindia.gov.in/",
            null,
            "Gujarat",
            "https://gujaratindia.gov.in/",
            LocalDate.now().minusDays(27)
        ));

        list.add(scheme(
            "Tamil Nadu Chief Minister's Crop Loan Relief Scheme",
            "Crop Loan",
            "Tamil Nadu scheme waiving crop loans for farmers affected by drought and natural calamities.",
            "Farmers in Tamil Nadu with outstanding crop loans from cooperative banks who suffered crop losses.",
            "Waiver of outstanding crop loan up to ₹2 lakh for eligible flood/drought affected farmers.",
            "Apply at primary agricultural cooperative society (PACS) with loan documents and loss assessment report.",
            "https://www.tn.gov.in/",
            LocalDate.now().plusMonths(5),
            "Tamil Nadu",
            "https://www.tn.gov.in/",
            LocalDate.now().minusDays(1)
        ));

        list.add(scheme(
            "Andhra Pradesh YSR Free Crop Insurance Scheme",
            "Crop Insurance",
            "Andhra Pradesh government pays the entire premium for crop insurance on behalf of farmers.",
            "All farmers in Andhra Pradesh growing notified crops in notified areas.",
            "Zero premium cost to farmer — state government pays farmer share of PMFBY premium. Full coverage against crop loss.",
            "Auto-enrolled for farmers registered in MeeSeva portal with Aadhaar-linked bank account.",
            "https://ap.gov.in/",
            LocalDate.now().plusMonths(2),
            "Andhra Pradesh",
            "https://ap.gov.in/",
            LocalDate.now().minusDays(13)
        ));

        list.add(scheme(
            "Madhya Pradesh Bhavantar Bhugtan Yojana",
            "General",
            "Price deficiency payment scheme ensuring farmers receive MSP equivalent for produce sold in mandis.",
            "Farmers in Madhya Pradesh registered on e-uparjan portal selling notified crops at APMC mandis.",
            "Payment of difference between MSP and actual market price directly to farmer bank account.",
            "Register on mpeuparjan.nic.in before harvest with Aadhaar, bank, and land documents.",
            "https://mpeuparjan.nic.in/",
            LocalDate.now().plusMonths(3),
            "Madhya Pradesh",
            "https://mpeuparjan.nic.in/",
            LocalDate.now().minusDays(17)
        ));

        list.add(scheme(
            "West Bengal Krishak Bandhu Scheme",
            "General",
            "West Bengal scheme providing financial assistance to farmers for farming activities and life insurance.",
            "All farmers in West Bengal with at least 1 katha (720 sq ft) of agricultural land.",
            "₹10,000 per acre per year in two installments plus ₹2 lakh life insurance coverage.",
            "Register at local agriculture office or gram panchayat with land records and Aadhaar.",
            "https://krishakbandhu.net/",
            null,
            "West Bengal",
            "https://krishakbandhu.net/",
            LocalDate.now().minusDays(24)
        ));

        list.add(scheme(
            "Bihar Rajya Fasal Sahayata Yojana",
            "Crop Insurance",
            "Bihar state crop assistance scheme providing compensation to farmers for actual crop loss.",
            "All raiyat (tenant) and non-raiyat farmers in Bihar growing kharif/rabi crops.",
            "₹7,500 per hectare for up to 20% crop loss; ₹10,000 per hectare for above 20% crop loss.",
            "Apply on pacsonline.bih.nic.in portal with Aadhaar, bank, land, and self-declaration documents.",
            "https://pacsonline.bih.nic.in/",
            LocalDate.now().plusMonths(1),
            "Bihar",
            "https://pacsonline.bih.nic.in/",
            LocalDate.now().minusDays(28)
        ));

        list.add(scheme(
            "e-NAM (National Agriculture Market)",
            "General",
            "Online trading platform for agricultural commodities connecting farmers directly to buyers across India.",
            "Farmers, traders, FPOs, and buyers registered with any integrated APMC mandi.",
            "Transparent price discovery, online payment, and access to buyers from all states without intermediaries.",
            "Register at enam.gov.in or nearest APMC mandi with Aadhaar, bank, and produce details.",
            "https://enam.gov.in/",
            null,
            "All India",
            "https://enam.gov.in/",
            LocalDate.now().minusDays(29)
        ));

        list.add(scheme(
            "Formation and Promotion of FPOs (Farmer Producer Organisations)",
            "General",
            "Government scheme to form 10,000 FPOs to provide collective bargaining power and access to resources for small farmers.",
            "Small and marginal farmers willing to form or join a Farmer Producer Organisation (FPO).",
            "Financial support of ₹18 lakh per FPO over 3 years, equity grant up to ₹15 lakh, and credit guarantee.",
            "Apply through implementing agencies — NABARD, SFAC, or state agriculture department.",
            "https://sfacindia.com/",
            null,
            "All India",
            "https://sfacindia.com/",
            LocalDate.now().minusDays(21)
        ));

        return list;
    }

    private GovernmentScheme scheme(String name, String category, String description,
                                     String eligibility, String benefits, String process,
                                     String link, LocalDate lastDate, String state,
                                     String source, LocalDate publishDate) {
        GovernmentScheme s = new GovernmentScheme();
        s.setSchemeName(name);
        s.setCategory(category);
        s.setDescription(description);
        s.setEligibility(eligibility);
        s.setBenefits(benefits);
        s.setApplicationProcess(process);
        s.setOfficialLink(link);
        s.setLastDate(lastDate);
        s.setState(state);
        s.setSource(source);
        s.setPublishDate(publishDate);
        s.setActive(true);
        return s;
    }
}
