-- Webstability Developer Account Seed
-- Run dit NADAT je schema.sql hebt uitgevoerd
-- 
-- STAP 1: Maak eerst een user aan via Supabase Auth dashboard
--         of via de API met email: laurensbos@webstability.nl
--
-- STAP 2: Run dit script om de developer role toe te kennen

-- Optie 1: Als je de user email weet
UPDATE public.users 
SET role = 'developer' 
WHERE email = 'info@webstability.nl';

-- Optie 2: Als je de user ID weet (vervang met echte UUID)
-- UPDATE public.users 
-- SET role = 'developer' 
-- WHERE id = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

-- Admin account (optioneel)
-- UPDATE public.users 
-- SET role = 'admin' 
-- WHERE email = 'admin@webstability.nl';

-- Controleer of het gelukt is
SELECT id, email, role, created_at 
FROM public.users 
WHERE role IN ('developer', 'admin');
