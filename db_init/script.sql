-- RESETTING TABLES (DELETE IF DATABASE IS UP FOR PRODUCTION)
DROP TABLE IF EXISTS "Teams";
DROP TABLE IF EXISTS "Leagues";
DROP TABLE IF EXISTS "Fixtures";
-------------------------------------------------------------

CREATE TABLE "Leagues" (
    id INT PRIMARY KEY,          
    name VARCHAR(255) NOT NULL,  
    country VARCHAR(255) NOT NULL,  
    logo VARCHAR(255) NOT NULL,          
    flag VARCHAR(255),           
    season INT NOT NULL,                  
    round VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP     
);


CREATE TABLE "Teams" (
    id INT PRIMARY KEY,          
    name VARCHAR(255) NOT NULL,  
    logo VARCHAR(255)  NOT NULL,           
    winner BOOLEAN,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP            

CREATE TABLE "Fixtures" (
    id INT PRIMARY KEY,       
    referee VARCHAR(255),   
    timezone VARCHAR(50) NOT NULL,         
    date DATE NOT NULL,             
    "timestamp" INT NOT NULL,                 
    "status_long" VARCHAR(255) NOT NULL,      
    "status_short" VARCHAR(50) NOT NULL, 
    "status_elapsed" INT,       
    league_id INT NOT NULL,
    home_team_id INT NOT NULL,                
    away_team_id INT NOT NULL,    
    home_goals INT,            
    away_goals INT,                
    home_odds FLOAT,          
    away_odds FLOAT,              
    draw_odds FLOAT,       
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_league
        FOREIGN KEY (league_id)     
        REFERENCES "Leagues"(id)
        ON DELETE CASCADE,  
    CONSTRAINT fk_home_team
        FOREIGN KEY (home_team_id)   
        REFERENCES "Teams"(id)
        ON DELETE CASCADE,    
    CONSTRAINT fk_away_team
        FOREIGN KEY (away_team_id) 
        REFERENCES "Teams"(id)
        ON DELETE CASCADE     
);

-- Triggers for columns updatedAt & createdAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leagues_updated_at
BEFORE UPDATE ON "Leagues"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON "Teams"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fixtures_updated_at
BEFORE UPDATE ON "Fixtures"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();