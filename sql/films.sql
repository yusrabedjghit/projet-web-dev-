-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 02 nov. 2025 à 16:01
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `films`
--

-- --------------------------------------------------------

--
-- Structure de la table `film`
--

CREATE TABLE `film` (
  `id` int(11) NOT NULL,
  `id_saga` int(11) NOT NULL,
  `titre` varchar(150) NOT NULL,
  `annee` varchar(10) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `synopsis` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `film`
--

INSERT INTO `film` (`id`, `id_saga`, `titre`, `annee`, `image`, `synopsis`) VALUES
(1, 1, 'Episode I - The Phantom Menace', '1999', 'https://th.bing.com/th/id/R.dedd648c0b43e61914fd4cd2eda82aca?rik=4xAZK7XqEnCDNQ&pid=ImgRaw&r=0', 'Un jeune Anakin Skywalker est découvert tandis que les Sith complotent dans l’ombre.'),
(2, 1, 'Episode II - Attack of the Clones', '2002', 'https://tse4.mm.bing.net/th/id/OIP.1LPdSTHjEzXT87-eTGsbHAHaLO?rs=1&pid=ImgDetMain&o=7&rm=3', 'La République est menacée par une armée séparatiste tandis qu’Anakin se rapproche de Padmé.'),
(3, 2, 'Rogue One: A Star Wars Story', '2016', 'https://www.chroniquedisney.fr/imgFiliale/lucas/2016-rogue-one-01.jpg', 'Un groupe rebelle vole les plans de l’Étoile de la Mort.'),
(4, 2, 'Solo: A Star Wars Story', '2018', 'https://www.chroniquedisney.fr/imgFiliale/lucas/2018-star-wars-solo-01.jpg', 'Les débuts de Han Solo dans le monde criminel.'),
(5, 3, 'Iron Man', '2008', 'https://www.chroniquedisney.fr/imgFiliale/marvel/2008-ironman1-1.jpg', 'Tony Stark crée une armure high-tech et devient Iron Man.'),
(6, 4, 'Doctor Strange', '2016', 'https://www.chroniquedisney.fr/imgFiliale/marvel/2016-doctor-strange-01.jpg', 'Un chirurgien découvre les arts mystiques après un accident.'),
(7, 5, 'Cendrillon', '1950', '', 'Une jeune fille exploitée par sa belle-famille trouve l’amour grâce à une magie inattendue.'),
(8, 6, 'La Reine des Neiges', '2013', '', 'Deux sœurs se réconcilient alors que des pouvoirs glacés plongent un royaume dans le chaos.');

-- --------------------------------------------------------

--
-- Structure de la table `possessions`
--

CREATE TABLE `possessions` (
  `id` int(11) NOT NULL,
  `id_utilisateur` int(11) NOT NULL,
  `id_film` int(11) NOT NULL,
  `statut` enum('possede','souhaite_separer') DEFAULT 'possede'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `possessions`
--

INSERT INTO `possessions` (`id`, `id_utilisateur`, `id_film`, `statut`) VALUES
(1, 1, 1, 'souhaite_separer'),
(2, 1, 2, 'souhaite_separer'),
(3, 1, 3, 'souhaite_separer'),
(4, 1, 4, 'souhaite_separer'),
(5, 1, 5, 'souhaite_separer'),
(6, 1, 6, 'souhaite_separer'),
(7, 1, 7, 'souhaite_separer'),
(8, 1, 8, 'souhaite_separer');

-- --------------------------------------------------------

--
-- Structure de la table `saga`
--

CREATE TABLE `saga` (
  `id` int(11) NOT NULL,
  `id_univers` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `saga`
--

INSERT INTO `saga` (`id`, `id_univers`, `nom`) VALUES
(1, 1, 'Skywalker Saga'),
(2, 1, 'Anthologies'),
(3, 2, 'MCU - Phase 1 à 3'),
(4, 2, 'MCU - Phase 4 et suivants'),
(5, 3, 'Classiques Disney'),
(6, 3, 'Princesses Modernes');

-- --------------------------------------------------------

--
-- Structure de la table `univers`
--

CREATE TABLE `univers` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `genre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `univers`
--

INSERT INTO `univers` (`id`, `nom`, `genre`) VALUES
(1, 'Star Wars', 'science-fiction'),
(2, 'Marvel', 'action'),
(3, 'Princesses', 'romance');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL,
  `nom_utilisateur` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_inscription` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `nom_utilisateur`, `email`, `mot_de_passe`, `date_inscription`) VALUES
(1, 'Ghouaiel Bilel', 'bilelg@icloud.com', '458f53ec6f41d055ce72466167f9713298434569e7223bab68938a78803793ed', '2025-11-02 12:16:20');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `film`
--
ALTER TABLE `film`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_saga` (`id_saga`);

--
-- Index pour la table `possessions`
--
ALTER TABLE `possessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_utilisateur` (`id_utilisateur`,`id_film`),
  ADD KEY `id_film` (`id_film`);

--
-- Index pour la table `saga`
--
ALTER TABLE `saga`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_univers` (`id_univers`);

--
-- Index pour la table `univers`
--
ALTER TABLE `univers`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom_utilisateur` (`nom_utilisateur`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `film`
--
ALTER TABLE `film`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `possessions`
--
ALTER TABLE `possessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `saga`
--
ALTER TABLE `saga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `univers`
--
ALTER TABLE `univers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `film`
--
ALTER TABLE `film`
  ADD CONSTRAINT `film_ibfk_1` FOREIGN KEY (`id_saga`) REFERENCES `saga` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `possessions`
--
ALTER TABLE `possessions`
  ADD CONSTRAINT `possessions_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `possessions_ibfk_2` FOREIGN KEY (`id_film`) REFERENCES `film` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `saga`
--
ALTER TABLE `saga`
  ADD CONSTRAINT `saga_ibfk_1` FOREIGN KEY (`id_univers`) REFERENCES `univers` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
