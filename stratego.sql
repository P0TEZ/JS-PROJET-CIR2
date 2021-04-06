-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  mar. 06 avr. 2021 à 20:24
-- Version du serveur :  5.7.17
-- Version de PHP :  5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `stratego`
--

-- --------------------------------------------------------

--
-- Structure de la table `inscrit`
--

CREATE TABLE `inscrit` (
  `id` int(100) NOT NULL,
  `username` varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `mdp` varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `inscrit`
--

INSERT INTO `inscrit` (`id`, `username`, `mdp`) VALUES
(1, 'az', '$2b$10$6pL8c50x8/8tT69J6o1z/.j8VZx8jL5y1JNGmRN0zZveeAOvk8lea'),
(2, 'qs', '$2b$10$ZYtYy5.O/a3inJeji8qw3e/uvEYYvZyM.4a0GbXsXxLyh1qP7kVW6');

-- --------------------------------------------------------

--
-- Structure de la table `resultats`
--

CREATE TABLE `resultats` (
  `username` varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `nb_win` int(11) NOT NULL,
  `nb_loose` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `resultats`
--

INSERT INTO `resultats` (`username`, `nb_win`, `nb_loose`, `time`, `score`) VALUES
('az', 3, 11, 0, 300),
('qs', 1, 10, 0, 110);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `inscrit`
--
ALTER TABLE `inscrit`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `inscrit`
--
ALTER TABLE `inscrit`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
